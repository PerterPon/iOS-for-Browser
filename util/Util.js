//nodejs和前端代码公用的文件

define( function( require, exports, module )){
    "use strict";

    /**
     * 数组以及对象的深拷贝
     * @param  {Object} obj 需要深拷贝的对象或者数组
     * @return {Object}
     */
    function deepCopy( obj ){
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
     * 绑定函数运行时的宿主对象
     * @param  {Function} fn   需要绑定的函数
     * @param  {Object}   obj  宿主对象
     * @param  {Array}    args 需要的参数
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
     * 监听事件
     * @param  {Object}   tarName   监听对象
     * @param  {String}   eventName 事件名称
     * @param  {Function} handler   事件处理函数
     * @return {void}
     */
    function listen( tarObj, eventName, handler ){
        tarObj[ 'ios_' + eventName ] = handler;

    }

    /**
     * 派发事件
     * @param  {Object} tarObj    派发对象
     * @param  {String} eventName 事件名称
     * @param  {Array}  params    参数
     * @return {void}
     */
    function notify( tarObj, eventName, params ){
        tarObj[ 'ios_' + eventName ].apply( tarObj, params );
    }

    var result = {
        deepcopy : deepcopy,
        bind     : bind,
        listen   : listen,
        notify   : notify
    };

    return result;
};