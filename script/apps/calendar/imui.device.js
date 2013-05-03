//手机端的一些东西比如touchmove事件的处理

(function($) {
    $.IMHistory = function() {
        var hist = [], pointer = 0, goType = -2, controller = "";
        var isApple = (/iphone|ipad/gi).test(navigator.appVersion), isIDevice = (/iphone|ipad|android/gi).test(navigator.appVersion);
        var footerHist = [], oldIndex;

        var setHash = function(page) {
            var pageId = page.jquery ? page.attr('id') : page.getAttribute('id');
            if (!pageId) {
                page.attr('id', pageId = 'n-' + (new Date).getTime());
            }
            location.hash = 'page=' + pageId;
        };

        var addToHistory = function(page, isReplace) {
            if (goType == 1) {
                goInHistory(false);
                goType = -2;
            }
            else {
                if (pointer) {
                    hist.splice(0, pointer);
                }

                var pageId = page.jquery ? page.attr('id') : page.getAttribute('id');
                if (isReplace) {
                    hist[0] = { page: page, hash: '#page=' + pageId, id: pageId };
                }
                else {
                    hist.unshift({ page: page, hash: '#page=' + pageId, id: pageId });
                }
                pointer = 0;
            }
        };

        var goInHistory = function(isBack) {
            isBack ? pointer++ : pointer--;
        }

        var getPageInfoFromHistory = function(i) { //默认为获取当前页的页面信息，i > 0 则取历史记录中的回退记录，i < 0 则为前进记录
            i = typeof i === "undefined" ? pointer : pointer + i;
            return hist[i];
        }

        var getChangeInHistory = function() { //获取当锚点变化后，页面时进行了前进(1)、后退(-1)、其他控件操作(0)、无任何操作为-2
            var pageHash = $.getQueryStr("#page");

            for (var i = -1; i <= 1; i++) {
                if (hist[pointer - i] && hist[pointer - i].id == pageHash) {
                    return i;
                }
            }

            return -2;
        }

        var setFooterHistory = function(footerInfoList) {
            var i;
            if (footerInfoList.length) {
                for (i = 0; i < footerInfoList.length; i++) {
                    footerHist.push({ hist: [], pointer: 0 });
                    if (footerInfoList[i]["active"]) {
                        footerHist[i]["hist"] = hist;
                        footerHist[i]["pointer"] = pointer;
                        oldIndex = i;
                    }
                }

                if (!$.typesOf(oldIndex, "number")) {
                    footerHist[0]["hist"] = hist;
                    footerHist[0]["pointer"] = pointer;
                    oldIndex = 0;
                }
            }
        }

        var changeHist = function(i) {
            hist.shift();
            footerHist[oldIndex]["hist"] = hist;
            footerHist[oldIndex]["pointer"] = pointer;

            hist = footerHist[i]["hist"];
            pointer = footerHist[i]["pointer"];
            oldIndex = i;
        }

        if (!isApple) {
            $(window).bind('hashchange', function(e) {
                goType = getChangeInHistory();
                if (goType == 0) {
                    //todo 控件事件
                    if (/(controller)/i.test(window.location.hash)) {
                        controller = $.getQueryStr("controller");
                    }
                    else {
                        if (controller && $.isFunction($.controllerBack[controller])) {
                            $.controllerBack[controller].call();
                        }
                    }
                }
                else if (goType == 1 || goType == -1) {
                    getPageInfoFromHistory(-goType).page.initSize().doNavigation(goType === -1);
                }
                else {
                    if (pointer == hist.length - 1) {
                        window.history.go(1);
                        if ($._conf.exit) {
                            try {
                                var f = eval($._conf.exit);
                                if (f && $.typesOf(f, 'function')) {
                                    f.call(null);
                                }
                            } catch (e) { }
                        }
                    }
                    else {
                        getPageInfoFromHistory(1).page.initSize().doNavigation(true);
                    }
                }
            });
        }

        return {
            addToHistory: addToHistory,
            goInHistory: goInHistory,
            getPageInfoFromHistory: getPageInfoFromHistory,
            setHash: setHash,
            setFooterHistory: setFooterHistory,
            changeHist: changeHist
        }
    }
})(jQuery);

(function($) { //设备事件处理
    var _touchTarget, hasTouch = 'ontouchstart' in window,
        eventStart = hasTouch ? 'touchstart' : 'mousedown',
        eventMove = hasTouch ? 'touchmove' : 'mousemove',
        eventEnd = hasTouch ? 'touchend' : 'mouseup',
        eventCancel = hasTouch ? 'touchcancel' : 'mouseup',
        isIDevice = (/iphone|ipad|android/gi).test(navigator.appVersion),
        m = Math;

    //    var supportedEvents = {
    //        touch: ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'gestureend'],
    //        mouse: ['mousedown', 'mousemove', 'mouseup', 'click']
    //    };

    $.extend({
        isTouchDown: false,
        isOnline: function() { return navigator.onLine; },
        offLine: function(data, fn) {
            if (fn == null) {
                fn = data;
                data = null;
            }

            return arguments.length > 0 ?
                    $(window).bind("offline", data, fn) :
                    $(window).trigger("offline");
        },
        onLine: function(data, fn) {
            if (fn == null) {
                fn = data;
                data = null;
            }

            return arguments.length > 0 ?
                    $(window).bind("online", data, fn) :
                    $(window).trigger("online");
        },
        changeCss: function(url, obj) {
            var cssObject;
            if (obj && !$.isNotDOM(obj)) {
                $(obj).attr("href", url);
            }
            else {
                cssObject = $("#im-change-css");
                if (cssObject.length) {
                    cssObject.attr("href", url);
                }
                else {
                    $("<link href='" + url + "' id='im-change-css' rel='stylesheet' type='text/css' />").appendTo($("head"));
                }
            }
        },
        geoLocation: function(options) {
            //需要跟google地图结合使用
            if (navigator.geolocation) {
                if (!$.isOnline() && $._conf.debugging) {
                    $.alert("网络无法连接，请检查您的网络。");
                    return;
                }

                var position0ptions = {};
                var method;
                var settings = {
                    type: "get",
                    success: null,
                    error: null,
                    enableHighAccuracy: false,
                    timeout: undefined,
                    maximumAge: 0
                };

                $.extend(settings, options);

                method = settings.type === "watch" ? "watchPosition" : "getCurrentPosition";
                position0ptions = {
                    enableHighAccuracy: settings.enableHighAccuracy,
                    timeout: settings.timeout,
                    maximumAge: settings.maximumAge
                };

                var watchID = navigator.geolocation[method](settings.success, settings.error, position0ptions);
                var clearWatch = function() {
                    navigator.geolocation.clearWatch(watchID);
                    watchID = null;
                };

                var returnGet = {
                    refresh: function() {
                        navigator.geolocation[method](settings.success, settings.error, position0ptions);
                    }
                }

                var returnWatch = {
                    clearWatch: clearWatch,
                    openWatch: function() {
                        watchID = navigator.geolocation[method](settings.success, settings.error, position0ptions);
                    }
                };

                return settings.type === "watch" ? returnWatch : returnGet;
            } else {
                $.alert("您的设备不支持定位，无法获取位置信息。");
            }
        },
        media: function(options) {
            if ($.isEmptyObject(options) || !options.url || (options.url && !options.url.length) || $.isNotDOM(options.container)) {
                return;
            }

            var settings = {
                type: "video",
                url: "",
                loop: false,
                controls: true,
                autoplay: false,
                preload: true,
                posterUrl: '',
                hidden: false //for audio hidden
            };

            $.extend(settings, options);

            var mediaList = $.typesOf(settings.url, "string") ? settings.url.split(",") : settings.url;
            var html = [], i = 0;
            var container = options.container.jquery ? options.container : $(options.container);
            var mediaStyle = "";

            if (settings.width || settings.height) {
                settings.width = $.typesOf(settings.width, "number") ? settings.width + "px" : settings.width;
                settings.height = $.typesOf(settings.height, "number") ? settings.height + "px" : settings.height;
                mediaStyle = 'style="' + (settings.width ? 'width: ' + settings.width + ';' : '') + (settings.height ? 'height: ' + settings.height + ';' : '') + '"';
            }

            settings.preload = settings.autoplay || settings.preload ? "auto" : "none";

            html.push('<div class="x-' + settings.type + '" ' + mediaStyle + '><' + settings.type + ' width="100%" height="100%" preload="'
                        + settings.preload + '" ' + (settings.controls ? 'controls="controls"' : '') + ' ' + (settings.loop ? 'loop="loop"' : '')
                        + ' ' + (settings.autoplay ? 'autoplay="autoplay"' : '') + ' class="'
                        + ((settings.posterUrl && !settings.autoplay) || (settings.type === "audio" && settings.hidden) ? 'x-hide' : '') + '">');

            for (i; i < mediaList.length; i++) {
                html.push('<source src="' + mediaList[i] + '">');
            }
            html.push('当前设备不支持</' + settings.type + '>');

            if (settings.type === "video" && settings.posterUrl && !settings.autoplay) {
                html.push('<div class="x-video-ghost" style="background: #000 url(' + settings.posterUrl + ') center center no-repeat;"></div>');
            }
            html.push('</div>');

            container.html(html.join(""));

            var player = $(settings.type, container)[0];
            var mediaPlay = function() {
                //經實測，在iPad Safari要play()前要先執行load()才能確保順利播放。 ?
                if ((/ipad/gi).test(navigator.appVersion)) {
                    player.load();
                }
                if (player.play && $.isFunction(player.play)) {
                    player.play();
                }
            }

            $(".x-video-ghost", container).bind("tap", function() {
                $(player).removeClass("x-hide");
                $(this, container).addClass("x-hide");
                mediaPlay();
            });

            return player;
        },
        getDragPos: function( e ) {
            var event = e.originalEvent || e;
            var x = event.clientX || (event.touches.length && event.touches[0].clientX) || (event.changedTouches&&event.changedTouches[0].clientX) || "0";
            var y = event.clientY || (event.touches.length && event.touches[0].clientY) || (event.changedTouches&&event.changedTouches[0].clientX) || "0";
            return { x: Number(x), y: Number(y) };
        }
    });

    //to do 当前的所有手机浏览器都不支持html5的drop和drag功能，可能存在操作模式的设计冲突，考虑未来也很难支持该功能，因此拖拽将使用js实现
    //document.write('<style type="text/css">[draggable=true] {-khtml-user-drag: element; -webkit-user-drag: element; -khtml-user-select: none; -webkit-user-select: none;}</style>');
    var checkDragEnter = function(drag, drop) {
        var dragOffset = drag.offset();
        var dropOffset = drop.offset();
        return dropOffset.top <= dragOffset.top && dropOffset.left <= dragOffset.left && (dropOffset.top + drop[0].offsetHeight) >= (dragOffset.top + drag[0].offsetHeight) && (dropOffset.left + drop[0].offsetWidth) >= (dragOffset.left + drag[0].offsetWidth);
    }

    $.fn.extend({
        //拖
        drag: function(options) {
            var that = this;
            var thisPosition = {};
            var startPosition;
            var movePosition;
            var matrix;
            var params = {};
            var dropContainer;
            var timer;
            var isIntoDrop = false;

            that.addClass("x-draggable").css("-webkit-transform", "translate3d(0px, 0px, 0px)").bind(eventStart, function(e) {
                e.preventDefault();

                matrix = new WebKitCSSMatrix(window.getComputedStyle(that[0], null).webkitTransform);
                thisPosition.x = matrix.m41;
                thisPosition.y = matrix.m42;
                startPosition = $.getDragPos(e);

                if (!that.attr("id")) {
                    that.attr("id", "imDragId" + String(m.random()).replace(/\D/g, ""));
                }
                params.dragId = that.attr("id");

                if (options.data) {
                    params.data = $.typesOf(options.data) === "string" ? options.data : JSON.stringify(options.data);
                }

                dropContainer = options.container;
                if (dropContainer) {
                    if ($.typesOf(dropContainer) === "string") {
                        params.containerId = dropContainer;
                    }
                    else if (($.typesOf(dropContainer) === "object")) {
                        dropContainer = $(dropContainer);
                        if (!dropContainer.attr("id")) {
                            dropContainer.attr("id", "imContainerId" + String(m.random()).replace(/\D/g, ""));
                        }
                        params.containerId = dropContainer.attr("id");
                    }
                }

                $.dragData = params;

                if (options.dragstart && $.isFunction(options.dragstart)) { //todo 整合
                    options.dragstart.call(that, e);
                }

                if ($.dragData.containerId) {
                    dropContainer = $("#" + $.dragData.containerId);
                    if (checkDragEnter(that, dropContainer)) {
                        isIntoDrop = true;
                        dropContainer.trigger("dragenter").trigger("dragover");
                    }
                    timer = setInterval(function() {
                        if (checkDragEnter(that, dropContainer)) {
                            if (!isIntoDrop) {
                                dropContainer.trigger("dragenter");
                            }
                            isIntoDrop = true;
                            dropContainer.trigger("dragover");
                        }
                        else {
                            if (isIntoDrop) {
                                isIntoDrop = false;
                                dropContainer.trigger("dragleave");
                            }
                        }
                    }, 100);
                }


            }).bind(eventEnd, function(e) {
                e.preventDefault();

                clearInterval(timer);
                startPosition = null;
                params = {};

                if (isIntoDrop) {
                    dropContainer.trigger("drop");
                    isIntoDrop = false;
                }
                else {
                    that.transition({ "-webkit-transform": "translate3d(" + thisPosition.x + "px, " + thisPosition.y + "px, 0px)" });
                }

                if (options.dragend && $.isFunction(options.dragend)) {
                    options.dragend.call(that, e);
                }
            });

            $("body").bind(eventMove, function(e) {
                if (startPosition) {
                    movePosition = $.getDragPos(e);
                    that.css("-webkit-transform", "translate3d(" + (thisPosition.x + movePosition.x - startPosition.x) + "px, " + (thisPosition.y + movePosition.y - startPosition.y) + "px, 0px)");

                    if (options.drag && $.isFunction(options.drag)) {
                        options.drag.call(that, e);
                    }
                }
            });

            return that;
        },

        //放
        drop: function(options) {
            var that = this;
            that.addClass("x-droppable").bind({
                "dragenter": function(e) {
                    if (options.dragenter && $.isFunction(options.dragenter)) {
                        options.dragenter.call(that, $.dragData);
                    }
                },
                "dragover": function(e) {
                    if (options.dragover && $.isFunction(options.dragover)) {
                        options.dragover.call(that, $.dragData);
                    }

                    e.stopPropagation();
                    e.preventDefault();
                },
                "drop": function(e) {
                    var files = e.dataTransfer ? e.dataTransfer.files : null;
                    var arguments = {
                        event: e,
                        dragElement: $.dragData.dragId ? $("#" + $.dragData.dragId) : null,
                        data: $.dragData.data,
                        files: files
                    };

                    if (options.drop && $.isFunction(options.drop)) {
                        options.drop.call(that, arguments);
                    }

                    e.preventDefault();
                },
                "dragleave": function(e) {
                    if (options.dragleave && $.isFunction(options.dragleave)) {
                        options.dragleave.call(that, $.dragData);
                    }
                }
            });
        }
    });

    //文本输入框和textarea的输入法导致window大小改变，而导致的遮盖问题，分别解决了有滚动条和没有滚动条的请况
    $(window).resize(function() {
        //加入$(":focus").length，解决横竖屏切换时出现的that[0].offsetHeight处bug
        if ($.imFocus) {
            setTimeout(function() {
                var that = $.imFocus,
                	scroll = that.parents(".scroll:first"),
                	thisHeight, canScrollHeight, footerHeight, headerHeight, sectionHeight,
                	offsetTop, bottom, top, scrollTopHeight, centerHeight, resultHeight;
                if (scroll[0]) {
                    scroll.refresh();

                    thisHeight = that[0].offsetHeight;
                    canScrollHeight = $(">div", scroll).height() - scroll.height();
                    footerHeight = $('footer').length ? $('footer')[0].offsetHeight : 0;
                    headerHeight = $(".x-header").length ? $(".x-header")[0].offsetHeight : 0;
                    sectionHeight = $("section").height();
                    //offsetTop = that[0].offsetTop + parseFloat($(">div", scroll).css("top")) + headerHeight;
                    offsetTop = that.offset().top;
                    bottom = sectionHeight - offsetTop - that[0].offsetHeight - footerHeight;
                    top = offsetTop - headerHeight;
                    centerHeight = (scroll.height() - thisHeight) / 2;
                    centerHeight = centerHeight < 0 ? 0 : centerHeight;

                    if (bottom < 0) {
                        scrollTopHeight = parseFloat(scroll.children().css("top"));
                        resultHeight = bottom + scrollTopHeight - centerHeight;
                        scroll.scrollTo(-resultHeight > canScrollHeight ? -canScrollHeight : resultHeight, 0);
                    }
                    else if (top < 0) {
                        scrollTopHeight = parseFloat(scroll.children().css("top"));
                        resultHeight = scrollTopHeight - top + centerHeight
                        scroll.scrollTo(resultHeight > 0 ? 0 : resultHeight, 0);
                    }
                }
            }, 200);
        }
    });

    //error提示
    $(window).bind("error", function(e) {
        throw( e );
        // if ($._conf.debugging) {
        //     alert("fileName: " + e.originalEvent.filename + "\r\nline: " + e.originalEvent.lineno + "\r\nmessage: " + e.originalEvent.message);
        // }
    })

    $(document).ready(function() {
        $(document.body).bind({
            "tap": function(e, _a) {
                var tapFn;
                //加入参数data，用于通过a标签触发body的tap事件，写法为：$(document.body).trigger('tap', [_a]); 其中_a = $("<a></a>")
                if (_a && _a[0] && _a.data('href')) {
                    e.preventDefault();
                    _a.appendTo($("body")).trigger('tapLink', e).remove();
                    _touchTarget = null;
                }
                if (_touchTarget && _touchTarget[0]) {
                    var $el = _touchTarget.data('href') || _touchTarget.attr("ontap") ? _touchTarget : getFirstParentsByAttr(_touchTarget);
                    if ($el) {
                        tapFn = $el.attr("ontap");
                        if (tapFn) {
                            try {
                                var f = eval(tapFn);
                                if (f && $.typesOf(f, 'function')) {
                                    f.call($el);
                                }
                            } catch (e) { }
                        }
                        else {
                            e.preventDefault();
                            $el.trigger('tapLink', e);
                        }
                    }
                    //判断是否input, textarea，是则做记录，用于输入法的resize
                    $.imFocus = _touchTarget && _touchTarget.is("input, textarea") ? _touchTarget : null;
                }
            },
            "initEvent": function() {
                var bodyEvent = new bodyEventManager($(this));
            }
        }).trigger('initEvent');
    
        $( document ).on( {
            "imStart": function() { $(this).addClass("x-button-pressed"); },
            "imMove": function() { $(this).removeClass("x-button-pressed"); },
            "tap": function() {
                var that = $(this);
                if (that.hasClass("x-tabs")) {
                    that.addClass("x-button-pressed").siblings().removeClass("x-button-pressed");
                }
                else {
                    that.addClass("x-button-pressed");
                    setTimeout(function() {
                        that.removeClass("x-button-pressed");
                    }, 200);
                }
            }
        }, 'div.x-button' );
        // $("div.x-button").live({
        //     "imStart": function() { $(this).addClass("x-button-pressed"); },
        //     "imMove": function() { $(this).removeClass("x-button-pressed"); },
        //     "tap": function() {
        //         var that = $(this);
        //         if (that.hasClass("x-tabs")) {
        //             that.addClass("x-button-pressed").siblings().removeClass("x-button-pressed");
        //         }
        //         else {
        //             that.addClass("x-button-pressed");
        //             setTimeout(function() {
        //                 that.removeClass("x-button-pressed");
        //             }, 200);
        //         }
        //     }
        // });
    });

    var cloneEvent = function(e, eventType) {
        var event = {};
        $.extend(event, e);

        event.type = eventType;

        return event;
    }

    var bodyEventManager = function(obj) {
        var that = obj.jquery ? obj[0] : obj;
        var timer, start, stop;

        var _start = function(e) {
            var $tar = _touchTarget = $(e.target);

            $.isTouchDown = true;

            start = $.getDragPos(e);
            start.startTime = new Date().getTime();

            timer = setTimeout(function() {
                if (_touchTarget && _touchTarget[0]) {
                    _touchTarget.trigger("taphold");
                    _touchTarget.trigger("imEnd");
                    _touchTarget = null;
                }
            }, 750);

            setTimeout(function() {
                if (_touchTarget && _touchTarget[0]) {
                    _touchTarget.trigger("imStart");
                }
            }, 100);

        };

        var _move = function(e) {
            clearTimeout(timer);

            stop = $.getDragPos(e);

            if (_touchTarget && _touchTarget[0]) {
                _touchTarget.trigger("imMove");
                _touchTarget = null;
            }
        };

        var _end = function(e) { //touch事件中touchend无法返回事件参数，其中e.touchs.length == 0, 需要通过touchmove来获取最后的位置信息
            clearTimeout(timer);
            var stop = $.getDragPos(e);
            $.isTouchDown = false;

            if (_touchTarget && _touchTarget[0]) {
                _touchTarget.trigger("imEnd");

                var event = hasTouch ? e : cloneEvent(e, "tap");
                _touchTarget.trigger("tap", [event]); //可以通过获取tap函数的第二个参数来获取event事件的详细信息

                _touchTarget = null;
            }

            //swipeLeft和swipeRight放在最后，不然在android版本中会出现卡死，不继续执行
            var stopTime = new Date().getTime();

            if (stopTime - start.startTime < 1000 && m.abs(start.x - stop.x) > 30 && m.abs(start.y - stop.y) < 75) {
                $(e.target).trigger(start.x > stop.x ? "swipeLeft" : "swipeRight");
            }

            delete start;
            delete stop;
        };

        var _scroll = function(e) {
            //使用系统滚动条时处理事件
        }

        that.addEventListener(eventStart, this, false);
        that.addEventListener(eventMove, this, false);
        that.addEventListener(eventEnd, this, false);
        that.addEventListener(eventCancel, this, false);
        that.addEventListener("scroll", this, false);

        this.handleEvent = function(e) {
            switch (e.type) {
                case eventStart:
                    _start(e);
                    break;
                case eventMove:
                    _move(e);
                    break;
                case eventEnd:
                case eventCancel:
                    _end(e);
                    break;
                case "scroll":
                    _scroll(e);
                    break;
            }
        }
        return this;
    }

    var getFirstParentsByAttr = function(obj) {
        var parents = obj.parents(), target;
        if (parents.length) {
            for (var i = 0; i < parents.length; i++) {
                if (parents.eq(i).data('href') || parents.eq(i).attr('ontap')) {
                    target = parents.eq(i);
                    break;
                }
            }
            return target;
        }
        return;
    }

})(jQuery);

/**
section part, dynamic divs
*/
(function($) {
    $.NBSection = function(opts) { //IMDevice
        var _history = new $.IMHistory(),
            process = opts.process,
            tranProcess = {
                "slide": "pageSlide",
                "slideup": "pageSlideUp",
                "flip": "pageFlip",
                "fade": "pageFade",
                "pop": "pagePop",
                "swap": "pageSwap",
                "cube": "pageCube",
                "none": "pageNone"
            };

        //需要从点击dom上传递给跳转页面的data，包含了tran跳转方式，sfn跳转前执行函数，fn和efn跳转后执行的函数
        var dataPassed = ["tran", "fn", "sfn", "efn"], i;

        //用来存放footer的data-数据
        var footerInfoCache = [];
        var isTapFooter = false;
        var currentFooter;
        //保证footer的跳转动画跟普通链接动画冲突而单独领出来
        var footerTran;

        var isIDevice = (/iphone|ipad|android/gi).test(navigator.appVersion);

        var hasOrientation = false;

        var setSize = function(obj) {
            //此处当项目使用web测试的时候，进行全局resize，而手机端则进行当前页面resize，提高效率，用于解决list隐藏时resize导致的样式问题 to do 优化
            var current = obj && obj.length && isIDevice ? obj : $("section");
            var windowHeight = $(window).height();
            var windowWidth = $(window).width();
            var full = current.hasClass("x-fullscreen") ? current : $('div.x-fullscreen', current);
            var content = $("div.x-content", current);
            var footer = $("footer");
            var footerHeight = !footer.length || footer.hasClass('x-hide') ? 0 : footer.outerHeight();
            var footerWidth = !footer.length || footer.hasClass('x-hide') ? 0 : footer.outerWidth();
            var scroll;
            var siblings;
            var siblingsHeight;

            if (footer.hasClass("x-footer-left") || footer.hasClass("x-footer-right")) {
                footer.css({ "height": windowHeight, "top": 0, "left": footer.hasClass("x-footer-right") ? windowWidth - footerWidth : 0 }).find(" > .x-footer").css("height", windowHeight);
                $('section').css({ "width": windowWidth - footerWidth, "height": windowHeight, "left": footer.hasClass("x-footer-left") ? footerWidth : 0, "position": "relative" });
                full.css({ "width": windowWidth - footerWidth, "height": windowHeight });
                content.css({ "height": windowHeight - $(".x-header").height(), "width": windowWidth - footerWidth });
            }
            else {
                $('section').css({ "width": windowWidth, "height": windowHeight }).removeStyle("left");
                footer.removeStyle("height,left");
                footerHeight = !footer.length || footer.hasClass('x-hide') ? 0 : footer.height();
                footer.css("top", windowHeight - footerHeight).find(" > .x-footer").removeStyle("height");
                full.css({ "width": windowWidth, "height": windowHeight - footerHeight });
                content.css({ "height": windowHeight - $(".x-header").height() - footerHeight, "width": windowWidth });
            }

            //页面中的滚动区域用scroll样式表示，而控件中的滚动区域则由x-scroller控制
            $("div.scroll", current).each(function() {
                scroll = $(this);
                siblings = scroll.siblings();
                if (siblings.length) {
                    siblingsHeight = 0;
                    siblings.each(function() {
                        siblingsHeight += $(this).height();
                    });
                    scroll.css("height", scroll.parent().height() - siblingsHeight);
                }
            });
        }

        //去除footer数据中的类似data-*这样的key的data-部分
        var processFooterInfo = function(data) {
            var result = {}, p, newKey;

            if (!data || $.isEmptyObject(data)) {
                return {};
            }

            for (p in data) {
                if (p.indexOf("data-") === 0) {
                    newKey = $.camelCase(p.substring(5));
                    result[newKey] = data[p];
                }
                else {
                    result[p] = data[p];
                }
            }

            return result;
        }

        var footerAction = function(isBack) {
            var footer = $("footer");
            var footerPosition = footer.hasClass("x-footer-right") ? "100%" : "-100%";

            if (isBack) {
                footer.css("webkitTransform", 'translateX(' + footerPosition + ')').removeClass("x-hide").transition({ "-webkit-transform": 'translateX(0%)' }, function() {
                    footer.removeStyle("-webkit-transform");
                });
                if (footer.hasClass("x-footer-left")) {
                    $("section").transition({ "left": footer.outerWidth() + 'px' });
                }
            }
            else {
                footer.transition({ "-webkit-transform": 'translateX(' + footerPosition + ')' }, function() {
                    footer.addClass("x-hide").removeStyle("-webkit-transform");
                });
                if (footer.hasClass("x-footer-left")) {
                    $("section").transition({ "left": '0px' });
                }
            }
        }

        var isLandscape = function() {
            return isIDevice ? screen.width > screen.height : $(window).width() > $(window).height();
        }

        $.footer = function(footerItemList, position) {
            var html = [], i;
            var footerItem;
            var footer;
            var footerTab;
            var footerClass = position ? position : ($._conf.landscape && isLandscape()) ? $._conf.landscape : "";

            if ($.isNoData(footerItemList) || $("footer").length) {
                if ($._conf.debugging) {
                    $.alert("已经存在footer或者传入数据不完整");
                }
                return;
            }

            if ($.typesOf(footerItemList) !== "array") {
                footerItemList = [footerItemList];
            }

            html.push('<footer class="' + (footerClass ? "x-footer-" + footerClass : "") + '"><div class="x-footer x-layout-box-inner x-layout-box x-scroller">');

            for (i = 0; i < footerItemList.length; i++) {
                footerItem = footerItemList[i];
                html.push('<div data-footer="' + i + '" class="x-tab' + (footerItem["active"] ? " x-tab-active" : "")
                        + '"><span class="x-button-label">' + footerItem["title"] + '</span><div class="' + footerItem["iconClass"] + '"></div></div>');

                footerInfoCache.push(processFooterInfo(footerItem));
                currentFooter = i;
            }

            html.push('</div></footer>');

            $("body").append(html.join(""));

            footer = $("footer");

            if (position) {
                footer.data("landscape", position);
            }

            setSize();

            _history.setFooterHistory(footerInfoCache);

            $(".x-tab", footer).bind("tap", function(e) {
                footerTab = $(this);
                if (!footerTab.hasClass("x-tab-active")) {
                    footerTab.addClass("x-tab-active").siblings().removeClass("x-tab-active");
                    e.target = footerTab[0];
                    tapHandler(e);
                }
            });
        }

        $.fn.footer = function(position) {
            var footer = $(this);
            var footerClass = position ? position : ($._conf.landscape && isLandscape()) ? $._conf.landscape : "";
            var hrefList = [];
            var that;

            if (!footer.is("footer")) {
                return footer;
            }

            if (footerClass) {
                footer.addClass("x-footer-" + footerClass);
                if (position) {
                    footer.data("landscape", position);
                }
            }

            setSize();

            footer.search(function() {
                return this.data("href");
            }).each(function(i) {
                hrefList.push(i);
                $(this).data("footer", i);
            })

            _history.setFooterHistory(hrefList);

            if ($(".scroll", footer).length) {
                footer.scroll();
            }
        }

        $.fn.initSize = function(isCreate) { //todo 完善
            var that = $(this);
            var windowHeight = $(window).height();
            var windowWidth = $(window).width();
            var full = that.hasClass("x-fullscreen") ? that : $('div.x-fullscreen', that);
            var content = $("div.x-content", that);
            var footer = $("footer");
            var footerHeight = that.data("nofooter") || !footer.length ? 0 : footer.outerHeight();
            var footerWidth = !footer.length || that.data("nofooter") ? 0 : footer.outerWidth();
            var scroll;
            var siblings;
            var siblingsHeight;

            if (footer.hasClass("x-footer-left") || footer.hasClass("x-footer-right")) {
                full.css({ "width": windowWidth - footerWidth, "height": windowHeight });
                content.css({ "height": windowHeight - $(".x-header").height(), "width": windowWidth - footerWidth });
            }
            else {
                full.css({ "width": windowWidth, "height": windowHeight - footerHeight });
                content.css({ "height": windowHeight - $(".x-header").height() - footerHeight, "width": windowWidth });
            }

            $("div.scroll", that).each(function() {
                scroll = $(this);
                siblings = scroll.siblings();
                if (siblings.length) {
                    siblingsHeight = 0;
                    siblings.each(function() {
                        siblingsHeight += $(this).height();
                    });
                    scroll.css("height", scroll.parent().height() - siblingsHeight);
                }
            });

            //非创建的页面不会重复执行sfn函数
            if (isCreate) {
                var fn = that.data("sfn");
                if (fn) {
                    try {
                        var f = eval(fn);
                        if (f && $.typesOf(f, 'function')) {
                            f.call(that);
                        }

                        delete f;
                        that.data("sfn", "");

                    } catch (e) { }
                }
            }

            return that;
        }

        $.fn.doNavigation = function(goingBack) {
            $(':focus').blur();
            var fromPage = $('section>.current');
            var toPage = this;

            if (toPage.is('.current')) {
                return this;
            }

            var tranMethod = goingBack ? fromPage.data("tran") : toPage.data("tran");
            if (isTapFooter && footerInfoCache.length) {
                tranMethod = footerTran;
            }

            tranMethod = tranMethod ? tranMethod.toLowerCase() : "slide";
            var tranFn = $[tranProcess[tranMethod]];
            tranFn = tranFn ? tranFn : $["pageSlide"];

            var fn = toPage.data("fn") || toPage.data("efn"); //跳转完执行的函数可以是data-fn，也可以是data-efn

            if (footerInfoCache.length) {
                footerInfoCache[currentFooter]["href"] = "#" + toPage.attr("id");
            }

            //控制footer的隐藏功能
            var noFooter = goingBack ? fromPage.data("nofooter") : toPage.data("nofooter");
            if (noFooter) {
                footerAction(goingBack);
            }

            if (goingBack) {
                //remote from history
                _history.goInHistory(true);
            } else {
                _history.addToHistory(toPage, !!toPage.data('remove'));
            }

            _history.setHash(toPage);
            isTapFooter = false;

            tranFn.call(null, toPage, fromPage, goingBack, function() {
                fromPage.removeClass('current');

                if (toPage.data('remove')) {
                    fromPage.disScroll().remove();
                    toPage.data('remove', "");
                }

                if (goingBack) {
                    $(".x-list-item.x-item-selected", toPage).removeClass("x-item-selected");
                }

                if (fn) {
                    try {
                        var f = eval(fn);
                        if (f && $.typesOf(f, 'function')) {
                            f.call(fromPage); //将fromPage作为参数传入，toPage可以通过$("section>div.current")来获取
                        }

                        delete f;
                        toPage.data("fn", "");

                    } catch (e) { }
                }
            });

            return this;
        };
        var insertPage = function(node, options) {
            var $node = $(node);
            var $ref = options.referrer;
            var remove = $ref.data('remove');
            var id = isTapFooter && footerInfoCache.length ? footerInfoCache[currentFooter]["id"] : $ref.data("id");
            var pageId = id ? id : 'n-' + (new Date).getTime();
            var idata;

            if (remove) {
                $node.data('remove', remove);
            }

            //从点击dom上将data传递给跳转页面
            for (i = 0; i < dataPassed.length; i++) {
                idata = dataPassed[i];
                if (isTapFooter && footerInfoCache.length) {
                    if (footerInfoCache[currentFooter][idata] && idata !== "tran") {
                        $node.data(idata, footerInfoCache[currentFooter][idata]);
                    }
                }
                else if ($ref.data(idata)) {
                    $node.data(idata, $ref.data(idata));
                }
            }

            if (!isTapFooter) {
                var tranMethod = $ref.data("tran");
                if ((!tranMethod || tranMethod === "slide") && $ref.data("nofooter")) {
                    $node.data("nofooter", "true");
                }

                $ref.attr('rhref', $ref.data('href')).data('href', '#' + pageId);
            }
            $node.attr('id', pageId).appendTo('section').initSize(true).doNavigation(false).scroll(); //参数传递优化
        };
        var showPageByHref = function(href, options) {
            if (/^#/.test(href)) {
                var page = $(href);
                var $ref = options.referrer;
                if (page.length != 0) {
                    var tranMethod = $ref.data("tran");
                    var remove = $ref.data('remove');
                    if (tranMethod) {
                        page.data("tran", tranMethod);
                    }
                    if (remove) {
                        page.data('remove', remove);
                    }
                    //控制footer与页面一起跳转，条件是为平移跳转并且不是点击footer
                    if ((!tranMethod || tranMethod === "slide") && !isTapFooter && $ref.data("nofooter")) {
                        page.data("nofooter", "true");
                    }
                    page.initSize().doNavigation();
                }
            } else {
                var doPage = function() {
                    $.getFileDate({
                        url: href,
                        success: function(node) {
                            insertPage(node, options);
                        }
                    })
                };
                if (typeof (process) == 'function') {
                    if (!process({ insert: function(node) { insertPage(node, options) }, href: href, referrer: options.referrer })) {
                        doPage();
                    }
                } else {
                    doPage();
                }
            }
        };
        var tapHandler = function(e) {
            var $el = $(e.target); //与传入的参数不符
            var footerIndex = $el.data("footer");
            var href = $el.data('href');

            if (footerIndex || footerIndex === 0) {
                footerIndex = Number(footerIndex);
                if (footerInfoCache.length) {
                    href = footerInfoCache[footerIndex]['href'];
                    //to do footerTran
                    footerTran = footerInfoCache[footerIndex]['tran'];

                    //防止footer多次点击
                    if (href == "#" + $.getQueryStr("page")) {
                        return;
                    }
                }

                _history.changeHist(footerIndex);
                isTapFooter = true;
                currentFooter = footerIndex;
            }

            if ('#' === href) {
                var backPageInfo = _history.getPageInfoFromHistory(1);
                if (backPageInfo) {
                    window.history.go(-1);
                }
            } else {
                showPageByHref(href, { referrer: $el });
            }
        };

        $(document).ready(function() {
            var section = $('section');
            var body = $(document.body);
            var current;
            var bodyCls = (/android/gi).test(navigator.appVersion) ? "x-android" : (/iphone|ipad/gi).test(navigator.appVersion) ? "x-ios" : "x-desktop";

            body.addClass(bodyCls).bind('tapLink', tapHandler);

            if (!section[0]) {
                //去除body中已经执行过的script，防止在插入section时重复执行
                body.find("script").remove();
                body.wrapInner("<section></section>");
                section = $('section');
            }

            setSize();

            //(".scroll, .x-scroller")
            body.find(".scroll, .hscroll").each(function() {
                $(this).scroll();
            });

            if (section.children('.current').length == 0) {
                section.children(':first').addClass('current');
            }

            current = section.children('.current');

            _history.setHash(current);
            _history.addToHistory(current);

            $(window).bind({
                "resize": function() {
                    if (hasOrientation) {
                        setSize();
                        hasOrientation = false;
                    }
                    else {
                        setSize($("section > div.current"));
                    }
                },
                "orientationchange": function() {
                    var orientation = window.orientation;
                    var landscape = $._conf.landscape;
                    var footer = $("footer");
                    if (!footer.data("landscape") && landscape) {
                        if (isLandscape()) {
                            footer.addClass("x-footer-" + landscape);
                        }
                        else {
                            footer.removeClass("x-footer-left x-footer-right");
                        }
                    }
                    hasOrientation = true;
                }
            });
        });

        return this;
    }
})(jQuery);


//phonegap相关

//(function($) {
//    $.pg = {};

//    var initPhoneGap = function() {
//        if (PhoneGap && !$.isEmptyObject(PhoneGap)) {
//            $.pg = {
//                ready: function(fn) {
//                    $(document).bind("deviceready", fn).trigger("deviceready");
//                },
//                alert: function(message, fn, title, buttonLabel) {
//                    navigator.notification.alert(message, fn ? fn : function() { }, title, buttonLabel);
//                },
//                confirm: function(message, fn, title, button) {
//                    navigator.notification.confirm(message, fn, title, button);
//                }
//            }
//        }
//    }

//    if (PhoneGap && !$.isEmptyObject(PhoneGap)) {
//        initPhoneGap();
//    }
//    else {
//        setTimeout(initPhoneGap, 1);
//    }
//})(jQuery);