//包括本地数据，ajax，websocket，跨域

//if(event.target instanceof HTMLLIElement) 判断是否是dom

/*  
*@Description: public javascript library for data   
*@Author:      zhengxin  
*@Update:      zhengxin(2011-11-09 13:00)  
*/

(function($) {
    $.extend({
        getAddrPrdfix: function() {
            var currentScript = $("SCRIPT"); //获取当前加载的所有SCRIPT
            var currentSrc = currentScript.eq(currentScript.length - 1).attr("src"); //获取本js文件的src路径
            var reg = new RegExp(/(\.\.\/||\.\/)+/g); //创建../ and ./的正则表达式
            var rs = reg.exec(currentSrc);
            return rs[0] ? rs[0] : ""; //获取调用当前js文件的页面中，改js文件路径的前缀，如../../js/IMUI/imui.data.js 则取到../../
        }
    });

    $.extend({
        //同步获取配置文件config.json中的数据,存入全局变量$中
        // _conf: eval('(' + $.ajax({ url: $.getAddrPrdfix() + "conf/config.json", async: false }).responseText + ')'),
        _conf : window.conf,
        //map, like java.util.HashMap
        NBMap: function(dat) {
            var _data = dat ? dat : {};
            var _that = this;
            this.put = function(key, value) {
                _data[key] = value;
                return _that;
            };
            this.get = function(key) {
                return _data[key];
            }
            this.remove = function(key) {
                delete _data[key];
            };
            this.data = function() {
                return _data;
            };
        }
    });
})(jQuery);

(function($) {

    var toString = Object.prototype.toString,
    trim = String.prototype.trim,
    classToType = {}, //用于存放类型的toString(obj)的字符串，用于判断类型
    db, dbName; //用于存放本地数据库的object和数据库名称

    $.extend({
        //判断类型，未来放在frame中
        typesOf: function(obj, type) {
            if ($.isEmptyObject(classToType)) {
                var typeArray = "Boolean Number String Function Array Date RegExp Object".split(" ");
                for (var i = 0; i < typeArray.length; i++) {
                    classToType["[object " + typeArray[i] + "]"] = typeArray[i].toLowerCase();
                }
            }
            var objType = obj == null ? String(obj) : classToType[toString.call(obj)] || "object";
            return type ? objType === type.toLowerCase() : objType;
        },
        isEmptyObject: function(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },
        isNoData: function(param) { //判断是否为undefined，null，[]及{}
            return (!param && param !== 0 && param !== false)
                || ($.typesOf(param) === "array" && param.length == 0)
                || ($.typesOf(param) === "object" && !$.isEmptyObject(param));
        },

        //判断传入的object是否是dom
        //event.target instanceof HTMLLIElement ?

        isNotDOM: function(obj) {
            return !obj
                || $.typesOf(obj) !== "object"
                || $.isEmptyObject(obj)
                || obj.length == 0;
        },
        trim: function(text) {
            return text == null ? "" : (trim ? trim.call(text) : text.toString().replace(/^\s+/, "").replace(/\s+$/, ""));
        },
        getQueryStr: function(text, strUrl) { //获取url上的某一项参数的值, todo 优化
            var url = strUrl ? strUrl : window.location.href;
            var rs = new RegExp("(^|)" + text + "=([^\&]*)(\&|$)", "gi").exec(url), tmp;

            if (tmp = rs) {
                return tmp[2];
            }

            return "";
        },
        setQueryStr: function(text, value, strUrl) { //修改url上的某一项参数的值, 当value为空字符串的时候，则为删除该项参数，并对?#&等符号做了相应处理
            var url = strUrl ? strUrl : window.location.href;
            var rs = new RegExp(text + "=([^\&]*)(\&|$)", "gi");

            var result = url.replace(rs, value ? text + "=" + value : "").replace(/(\?\&|\#\&)/g, function(word) { return word.substring(0, word.length - 1) });

            if (/(\?$|\#$|\&$)/g.test(result)) {
                return result.substring(0, result.length - 1);
            }

            return result;
        },
        urlToJson: function(strUrl) { //返回url中每个部分的内容，包括协议、URL中包含的用户名和密码、主机名、端口、路径名、参数、锚点等信息
            var urlInfo = {},
                url = strUrl && $.typesOf(strUrl, "string") ? strUrl : window.location.href,
                regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/,
                fields = { 'Username': 4, 'Password': 5, 'Port': 7, 'Protocol': 2, 'Host': 6, 'Pathname': 8, 'URL': 0, 'Querystring': 9, 'Hash': 10 };

            var urlArry = regex.exec(url);

            for (var p in fields) {
                if (p == 'Hash') {
                    urlInfo[p.toLowerCase()] = "#" + urlArry[fields[p]];
                }
                else {
                    urlInfo[p.toLowerCase()] = urlArry[fields[p]];
                }
            }

            return urlInfo;
        },
        // to do 通过完善此方法，并修改使用到date的地方。 当前x为日期对象，y为需要显示的格式，例如yyyy-MM-dd hh:mm:ss
        dateToStr: function(x, y) {
            var z = { y: x.getFullYear(), M: x.getMonth() + 1, d: x.getDate(), h: x.getHours(), m: x.getMinutes(), s: x.getSeconds() };
            return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) { return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2)) });
        },
        sort: function(list, property, grouped, direction) {
            var isNumber;
            var stringSortRule;
            var numberSortRule;
            var result;
            var resultJson = {};
            var listValue;
            var i;

            if ($.typesOf(list) !== "array" || !list.length || ($.typesOf(list[0]) === "object" && !list[0][property])) {
                return list;
            }

            direction = direction || $.typesOf(grouped) === "number" && grouped || $.typesOf(property) === "number" && property || 1;
            grouped = $.typesOf(grouped) === "boolean" && grouped || $.typesOf(property) === "boolean" && property || false;
            property = $.typesOf(property) === "string" && property || "";
            isNumber = property ? $.typesOf(list[0][property], "number") : $.typesOf(list[0], "number");

            numberSortRule = function(a, b) {
                a = property ? a[property] : a;
                b = property ? b[property] : b;
                return direction >= 0 ? (a - b) : (b - a);
            }

            stringSortRule = function(a, b) {
                a = property ? $.trim(a[property]) : $.trim(a);
                b = property ? $.trim(b[property]) : $.trim(b);
                return direction >= 0 ? a.localeCompare(b) : b.localeCompare(a);
            }

            result = list.sort(isNumber ? numberSortRule : stringSortRule);

            if (grouped) {
                $.each("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" "), function(i, name) {
                    resultJson[name] = [];
                });
                for (i = 0; i < list.length; i++) {
                    listValue = property ? list[i][property] : list[i];
                    resultJson[$.trim(listValue).charAt(0).toUpperCase()].push(list[i]);
                }

                return resultJson;
            }

            return result;
        },
        setTemplete: function(tpl, dataList) {
            if (!dataList || !dataList.length) {
                return "";
            }

            var isDataItemObject = $.typesOf(dataList[0]) === "object" ? true : false;

            if (isDataItemObject && $.isEmptyObject(dataList[0])) {
                return "";
            }

            var imReg = new RegExp(/\{ *\$(\w+) *\}/g);
            var matchList = imReg.exec(tpl);
            var tplParamsKey = [];
            var tplParamsValue = [];
            var html = [];
            var dataShow, p, currentData;

            if (!matchList || !matchList.length) {
                return tpl;
            }

            while (matchList) {
                tplParamsKey.push(matchList[1]);
                tplParamsValue.push(matchList[0]);
                matchList = imReg.exec(tpl);
            }

            for (var i = 0; i < dataList.length; i++) {
                if (tplParamsKey[0] === "imAll") {
                    if (isDataItemObject) {
                        dataShow = "";
                        for (p in dataList[i]) {
                            dataShow += dataList[i][p] + " ";
                        }
                        html.push(tpl.replace(/\{\$imAll\}/g, dataShow.substring(0, dataShow.length - 1)));
                    }
                    else {
                        html.push(tpl.replace(/\{\$imAll\}/g, dataList[i]));
                    }
                }
                else {
                    dataShow = tpl;
                    for (var j = 0; j < tplParamsKey.length; j++) {
                        currentData = dataList[i][tplParamsKey[j]];
                        dataShow = dataShow.replace(tplParamsValue[j], currentData ? currentData : "");
                    }
                    html.push(dataShow);
                }
            }

            return html.join("");
        }
    });

    $.fn.extend({
        //dom所有子节点的筛选功能，参数是condition，类型是function，该函数需要返回值true或false
        search: function(condition) {
            var container = $(this);
            var filter = new Object();
            //手动创建出一个空的jquery对象
            var result = new $.fn.init();
            var iterator, node, i = 0;
            //NodeFilter在IE中不能使用
            if (!condition || !$.typesOf(condition, "function") || !NodeFilter) {
                return container;
            }

            filter.acceptNode = function(node) {
                /*
                如果应该访问给定的节点，那么该方法返回NodeFilter.FILTER_ACCEPT;
                如果不应该访问该节点并且其子节点也没兴趣，则返回NodeFilter.FILTER_REJECT;
                如果不应该访问该节点但仍对其子节点有兴趣，则返回NodeFilter.FILTER_SKIP 
                */
                return condition.call($(node)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }

            iterator = document.createTreeWalker(container[0], NodeFilter.SHOW_ELEMENT, filter, false);
            node = iterator.nextNode();
            while (node) {
                result[i] = node;
                node = iterator.nextNode();
                i++;
            }

            result.context = container[0];
            result.selector = this.selector + " search(" + String(condition) + ")";
            result.prevObject = container;
            result.length = i;
            return result;
        }
    });

    //判断使用本地缓存时处理用户传入的isSession参数，转化成boolean格式
    var defaultIsSession = function(bool) {
        var isSession = bool ? bool : false;
        if (isSession && $.typesOf(isSession) === "string") {
            isSession = $.trim(isSession) == "true" ? true : false;
        }
        return isSession;
    }

    //本地缓存
    $.extend({
        getLocalStorage: function(key, bool) {
            return $.handleLocalStorage({
                handle: "get",
                key: String(key),
                isSession: defaultIsSession(bool)
            });
        },
        setLocalStorage: function(key, data, bool) {
            $.handleLocalStorage({
                handle: "set",
                key: String(key),
                data: data,
                isSession: defaultIsSession(bool)
            });
        },
        removeLocalStorage: function(key, bool) {
            $.handleLocalStorage({
                handle: "remove",
                key: String(key),
                isSession: defaultIsSession(bool)
            });
        },
        clearLocalStorage: function(bool) {
            $.handleLocalStorage({
                handle: "clear",
                isSession: defaultIsSession(bool)
            });
        },
        handleLocalStorage: function(param) {
            if (window.localStorage) {
                var options = {
                    handle: "get",
                    key: "IMUI",
                    data: "",
                    isSession: false,
                    dataType: "string"
                },
                param = $.typesOf(arguments[0]) === "object" ? arguments[0] : {};

                if (!$.isEmptyObject(param)) {
                    $.extend(options, param);
                }
                else {
                    return;
                }

                options.dataType = $.typesOf(options.data);

                var fnStorage = options.isSession ? window.sessionStorage : window.localStorage,
                    results,
                    setLocalStorage = function() {
                        var jsonData = JSON.stringify({
                            data: $.typesOf(options.data) === "object" ? JSON.stringify(options.data) : String(options.data),
                            dataType: options.dataType
                        });
                        fnStorage.removeItem(options.key); //for the iPhone/iPad bug of QUOTA_EXCEEDED_ERR
                        fnStorage.setItem(options.key, jsonData);
                    };

                switch (options.handle) {
                    case "get": results = fnStorage.getItem(options.key); break
                    case "set": setLocalStorage(); break
                    case "remove": fnStorage.removeItem(options.key); break
                    case "clear": fnStorage.clear(); break
                }

                if (options.handle == "get") {
                    results = JSON.parse(results);
                    if (!results) {
                        return results;
                    }
                    var resultsData = results.data;
                    switch (results.dataType) {
                        case "string": results = resultsData; break
                        case "number": results = Number(resultsData); break //Number() String() Boolean()强制类型转换的结果是基本类型而不是对象
                        case "boolean": results = $.trim(resultsData) == "true" ? true : false; break
                        case "object": results = JSON.parse(resultsData); break
                        case "function":
                        case "regexp": results = eval("(" + resultsData + ")"); break
                        case "date": results = new Date(resultsData.replace(/-/g, "/")); break
                        case "array": results = resultsData.split(","); break
                        default: results = "undefined"
                    }
                    return results;
                }
            }
            else {
                //todo from cookie
                return {};
            }

            return;
        }
    });


    var debugging = $._conf.debugging; // Debugging Window
    var debug = function(error) { // Create debug mode window
        if (!$("#debugMode")[0]) {
            $("body").append("<div style='position:abolute;top:0 !important;left:0 !important;width:100% !important;min-height:100px !important; height:300px; overflow:scroll;z-index:1000; display:block; opacity:0.8; background:#000;-webkit-backface-visibility:visible ' id='debugMode'></div>");
        }
        $("#debugMode").append("<div class='debugerror'>" + error + "</div>");
    }

    //本地数据库
    $.extend({
        imOpen: function(name, version, desc, size) {	// Open database
            dbName = name
            if (window.openDatabase) {
                db = openDatabase(name, version, desc, size);
                if (!db) {
                    debugTxt = ("Failed to open the database on disk.  This is probably because the version was bad or there is not enough space left in this domain's quota");
                    if (debugging) { debug(debugTxt) }
                }
            } else {
                debugTxt = ("Couldn't open the database.  Please try with a WebKit nightly with this feature enabled");
                if (debugging) { debug(debugTxt) }
            }
        },
        imCreateTables: function(tbJson) {

            for (x = 0; x < tbJson.createTables.length; x++) {	// Loop in the json for every table
                createQuery(tbJson.createTables[x]);
            }
            function createQuery(tbNode) {			// Create the SQL that will create the tables
                debugTxt = "create table " + tbNode.table;
                var stringQuery = "CREATE TABLE " + tbNode.table + " (";
                nodeSize = tbNode.property.length - 1;
                for (y = 0; y <= nodeSize; y++) {
                    stringQuery += tbNode.property[y].name + " " + tbNode.property[y].type;
                    if (y != nodeSize) { stringQuery += ", " }
                }
                stringQuery += ")";
                imExecuteQuery(stringQuery, debugTxt);
            }
        },
        imDeleteRow: function(table, key, value) {		// Simple Delete row
            stringQuery = "DELETE FROM " + table + " WHERE " + key + " = " + value;
            debugTxt = "delete row" + key + " " + value;
            imExecuteQuery(stringQuery, debugTxt);
        },
        imSelectAll: function(table, fn) {
            stringQuery = "SELECT * FROM " + table;
            debugTxt = "selecting everything in table " + table;
            imExecuteQuery(stringQuery, debugTxt, fn);
        },
        imDropTable: function(table) {
            stringQuery = "DROP TABLE " + table;
            debugTxt = "delete table " + table;
            imExecuteQuery(stringQuery, debugTxt);
        },
        imInsertRows: function(tbJson) {		// Insert Row
            for (x = 0; x < tbJson.addRow.length; x++) { 		// loop in every row from JSON
                createQueryRow(tbJson.addRow[x]);
            }
            function createQueryRow(tbNode) {		// Create every row SQL
                debugTxt = "create row " + tbNode.table;

                stringQuery = "INSERT INTO " + tbNode.table + " ("
                nodeSize = tbNode.property.length - 1;
                for (y = 0; y <= nodeSize; y++) {
                    stringQuery += tbNode.property[y].name;
                    if (y != nodeSize) { stringQuery += ", " }
                }
                stringQuery += ") VALUES (";
                for (y = 0; y <= nodeSize; y++) {
                    stringQuery += '"' + tbNode.property[y].value + '"';
                    if (y != nodeSize) { stringQuery += ", " }
                }
                stringQuery += ")";
                imExecuteQuery(stringQuery, debugTxt);
            }
        },

        imExecuteQuery: function(stringQuery, debugTxtRaw, fn) {		// Execute all query, can be called in website script
            debugTxtRaw += "<br> SQL: " + stringQuery;
            callback = fn; 										// Callback

            if (!db) {
                imOpen("IMUI_DB", "1.0", "database of IMUI", 1024 * 1024);
            }

            db.transaction(function(tx) {
                tx.executeSql(stringQuery, [], function(tx, result) { 	// Execute SQL
                    if (callback) { callback(result); } 				// Execute callback
                    if (debugging) {
                        debugTxtRaw += "<br><span style='color:green'>success</span> ";
                        debug(debugTxtRaw);
                    }
                }, function(tx, error) {
                    debugTxtRaw += "<br><span style='color:red'>" + error.message + "</span> ";
                    if (debugging) {
                        debug(debugTxtRaw);
                    }
                });
            });
        }
    });

})(jQuery);

//webSocket
(function($) {
    $.webSocket = function(options) {
        if (!$.isOnline() && $._conf.debugging) {
            $.alert("网络无法连接，请检查您的网络。");
            return;
        }

        var settings = {
            url: "",
            open: function() { },
            close: function() { },
            message: function() { },
            error: function() { },
            status: ["CONNECTING", "OPEN", "CLOSING", "CLOSED"]
        };

        $.extend(settings, options);

        // let's invite Firefox to the party.
        if (window.MozWebSocket) {
            window.WebSocket = window.MozWebSocket;
        }

        if (typeof window.WebSocket === "undefined") {
            if ($._conf.debugging) {
                $.alert("Sockets not supported");
            }
            return;
        }

        var ws = {};
        var openConnection = function() {
            if (ws.readyState === undefined || ws.readyState > 1) {
                ws = new WebSocket(settings.url);

                ws.onopen = settings.open;
                ws.onclose = settings.close;
                ws.onmessage = function(e) {
                    var message = e.data;
                    settings.message.call(null, message, e);
                };
                ws.onerror = settings.error;
            }
        }
        var closeConnection = function() {
            ws.close();
        }

        $(window).unload(function() {
            closeConnection();
            ws = null;
        });

        openConnection();

        return {
            send: function(data, fn) {
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify(data));

                    if (fn && $.isFunction(fn)) {
                        fn.call(null, data);
                    }
                }
                else {
                    $.alert("Sockets is" + settings.status[ws.readyState]);
                    return;
                }
            },
            reconnect: function() {
                if (ws.readyState === 1) {
                    closeConnection();
                }
                setTimeout(function() {
                    openConnection();
                }, 100);
            },
            disconnect: function() {
                closeConnection();
            },
            getStatus: function() {
                return { "status": ws.readyState, "statusName": settings.status[ws.readyState] };
            }
        }

    };

    $.websocket = $.webSocket;
})(jQuery);

/**
datas
*/
(function($) {
    var invokeMethod = function(method, params) {
        if (method) {
            return method(params);
        }
        return false;
    };
    var ready = function(o) {
        invokeMethod(o.ready);
    };

    if ($._conf.ready) {
        ready($._conf);
    }

    var rootURL = $._conf.rootURL,
            DEFAULT_TIMEOUT = $._conf.timeout || 0,
            debugging = $._conf.debugging || false,
            map = new $.NBMap(),
            ident = 0;

    $.navigationTo = function(opts) {
        var _a = false;
        var _id = false;
        if (opts.keepTo) {
            _a = $(opts.keepTo).find('>a:last');
            _id = _a.attr("id");
            if (_a.length != 0 && _id && _id.indexOf('_nav') != -1) {
                _a.trigger('tap');
                return;
            }
        }
        _id = '_nav' + (++ident);
        _a = $('<a id="' + _id + '" href="' + opts.url + '"' + (opts.json ? ' json="' + opts.json + '"' : '') + (opts.data ? ' params="' + opts.data + '"' : '') + (opts.cacheKey ? ' cacheKey="' + opts.cacheKey + '"' : '') + (opts.remote ? ' remote="true"' : '') + (opts.keepTo ? '' : ' remove="true"') + '></a>');
        _a.appendTo(!opts.keepTo ? 'body' : opts.keepTo).trigger('tap');
        map.put(_id, { complete: function() {
            if (!opts.keepTo) {
                _a.remove();
                map.remove(_id);
            }
            invokeMethod(opts.complete);
        }, options: opts
        });
    };
    $.sendRequest = function(opts) {
        var _cdata = { type: 'jsonp', online: $.isOnline() };
        var settings = {
            showLoading: true
        };

        var loadingBox;

        if (opts) {
            $.extend(settings, opts);
        }

        if (!$.isOnline()) {	//off line
            invokeMethod(settings.error, _cdata);
            invokeMethod(settings.complete);
        } else {
            if (!!settings.showLoading) {
                loadingBox = new $.loadingBox(settings.message);
            }
            $.ajax({
                url: (settings.rootURL ? settings.rootURL : rootURL) + settings.url,
                dataType: _cdata.type,
                timeout: settings.timeout ? settings.timeout : DEFAULT_TIMEOUT,
                data: settings.data,
                success: function(data) {
                    invokeMethod(settings.success, data);
                },
                error: function(e) {
                    invokeMethod(settings.error, _cdata);
                },
                complete: function(d) {
                    if (!!loadingBox) {
                        loadingBox.hide();
                    }
                    invokeMethod(settings.complete);
                }
            });
        }
    };

    $.getFileDate = function(opts) { //to do 需要测试XML的情况
        var settings = {
            type: "text",
            showLoading: true
        };
        //datatype 包括 text 和 XML

        var loadingBox;

        if (opts) {
            $.extend(settings, opts);
        }

        var _cdata = { type: settings.type, online: $.isOnline() };

        $.ajax({
            url: settings.url,
            dataType: _cdata.type,
            timeout: settings.timeout ? settings.timeout : DEFAULT_TIMEOUT,
            //data参数在android 3.0及以上系统会导致获取失败
            //data: settings.data,
            success: function(data) {
                invokeMethod(settings.success, data);
            }, error: function(e) {
                invokeMethod(settings.error, _cdata);
            },
            complete: function(d) {
                invokeMethod(settings.complete);
            }
        });
    };

    if ($.NBSection) {
        var NBSection = new $.NBSection({
            process: function(opts) {
                var $ref = opts.referrer;
                var jsonUrl = $ref.data('json');
                if (jsonUrl) {
                    var successFunc = function(page) {
                        var page = $('<div></div>').setTemplate(page);
                        var params = $ref.data('params');
                        if (params) {
                            var ps = params.split('&');
                            for (var i = 0; i < ps.length; i++) {
                                var p = ps[i].split('=');
                                page.setParam(p[0], p[1]);
                            }
                        }
                        var _opts = map.get($ref.attr('id'));
                        _opts = _opts ? _opts : { options: {} };
                        var processData = function(data) {
                            opts.insert(page.processTemplate(typeof (data) == 'object' ? data : eval('(' + data + ')')));
                            invokeMethod(_opts.complete);
                        };
                        var cacheKey = $ref.data('cacheKey');
                        var _cdata = { type: 'cache', online: $.isOnline() };
                        if (cacheKey && !$.isOnline()) {	//off line
                            var _data = localStorage.getItem(cacheKey);
                            if (_data) {
                                invokeMethod(_opts.options.success, _cdata);
                                processData(_data);
                            } else {
                                invokeMethod(_opts.options.error, _cdata);
                            }
                        } else {
                            if (cacheKey) {	//reander from cache
                                var _data = localStorage.getItem(cacheKey);
                                if (_data) {
                                    invokeMethod(_opts.options.success, _cdata);
                                    processData(_data);
                                    return;
                                }
                            }
                            var remote = $ref.data('remote');
                            _cdata.type = remote == 'true' ? 'jsonp' : 'text';
                            if (!$.isOnline() && _cdata.type == 'jsonp') {
                                invokeMethod(_opts.options.error, _cdata);
                                return;
                            }
                            
                            
                            //$.ajax中的data参数，如果是获取本地文件，则在4.0的android系统中必须去掉，不然会出现404错误
                            $.ajax({
                                url: remote == 'true' ? (_opts.options.rootURL ? _opts.options.rootURL : rootURL) + jsonUrl : jsonUrl,
                                data: remote == 'true' ? params : "",
                                timeout: _opts.options.timeout ? _opts.options.timeout : DEFAULT_TIMEOUT,
                                dataType: _cdata.type,
                                success: function(data) {
                                    if (typeof (data) != 'object') {
                                        data = eval('(' + data + ')');
                                    }
                                    if (cacheKey) {
                                        data._saveTime = new Date().getTime();
                                        localStorage.setItem(cacheKey, JSON.stringify(data));
                                    }
                                    invokeMethod(_opts.options.success, _cdata);
                                    processData(data);
                                },
                                error: function(res) {
                                    invokeMethod(_opts.options.error, _cdata);
                                }
                            });
                        }
                    };
                    //template
                    $.getFileDate({
                        url: opts.href,
                        success: successFunc
                    })
                    return true;
                }
                return false;
            }
        });
    }
})(jQuery);