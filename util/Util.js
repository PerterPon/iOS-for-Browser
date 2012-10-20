//nodejs和前端代码公用的文件

define( function( require, exports, module ){
    "use strick";

    /**
     * [deepCopy 数组以及对象的深拷贝]
     * @param  {[type]} obj [需要深拷贝的对象或者数组]
     * @return {Object} out [拷贝完成的对象或数组]     
     */
    function deepcopy( obj ){
        var out = [],i = 0,len = obj.length;
        for ( ; i < len; i++ ) {
            if ( obj[ i ] instanceof Array ){
                out[ i ] = deepcopy( obj[ i ]);
            }
            else out[ i ] = obj[ i ];
        }
        return out;
    }

    /**
     * [bind 绑定函数运行时的宿主对象]
     * @param  {Function} fn   [需要绑定的函数]
     * @param  {Object}   obj  [宿主对象]
     * @param  {Array}    args [需要的参数]
     * @return {Function}
     */
    function bind( fn, obj, args ){
        return function() {
            args         = args || [];
            var callArgs = Array.prototype.slice.call( arguments, 0 );
            callArgs     = callArgs.concat( args );
            obj = obj || window;
            return ( $.isFunction( fn ) ? fn : obj[ fn ]).apply( obj, callArgs );
        };
    }

    /**
     * [listen 监听事件]
     * @param  {Object}   tarObj    [监听对象]
     * @param  {String}   eventName [事件名称]
     * @param  {Function} handler   [事件处理函数]
     * @param  {Object}   scope     [事件处理函数宿主对象]
     * @return {void}
     */
    function listen( tarObj, eventName, handler, scope ){
        tarObj[ 'ios_' + eventName ] ? '' : tarObj[ 'ios_' + eventName ] = [];
        tarObj[ 'ios_' + eventName ].push({
            handler : handler,
            scope   : scope || tarObj
        });
    }

    var objPool = {};

    /**
     * [notify 派发事件]
     * @param  {Object} tarObj    [派发对象]
     * @param  {String} eventName [事件名称]
     * @param  {Array}  params    [参数]
     * @return {void}
     */
    function notify( tarObj, eventName, params ){
        var evntInstnc = tarObj[ 'ios_' + eventName ];
        if( !evntInstnc ){
            return;
        }
        for( var i = 0; i < evntInstnc.length; i++ ){
            evntInstnc[ i ].handler.apply( evntInstnc[ i ].scope || tarObj, params );
        }
        
    }

    var result = {
        deepcopy : deepcopy,
        bind     : bind,
        listen   : listen,
        notify   : notify
    };

    return result;
});