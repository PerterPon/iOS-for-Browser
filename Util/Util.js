//nodejs和前端代码公用的文件
//nodejs和前端代码公用的文件

define( function( require, exports, module )){
    "use strict";

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

    function bind( fn, obj, args ){
        return function() {
            args         = args || [];
            var callArgs = Array.prototype.slice.call( arguments, 0 );
            callArgs     = callArgs.concat( args );
            obj = obj || window;
            return ( $.isFunction( fn ) ? fn : obj[ fn ]).apply( obj, callArgs );
        };
    }

    var result = {
        deepcopy : deepcopy,
        bind     : bind
    };

    iOS.Util.Util = result;

    return result;
};