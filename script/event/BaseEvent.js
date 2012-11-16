
define( function( require, exports, model ){
    "use strick";

    Ext.define( 'BaseEvent', {

        //按下时所执行的函数
        _touchStart          : function(){},
        
        //移动时所执行的函数
        _touchMove           : function(){},

        //弹起时所执行的函数
        _touchStop           : function(){},

        constructor : function( cfg ){
            for( var i in cfg ){
                ( ( '_' + i ) in this ) && ( this[ '_' + i ] = cfg[ i ] );
            }
        },

        /**
         * [_getTouchPos 根据具体的环境，获取pageX的父对象]
         * @param  {MouseEvent}  event  [事件对象]
         * @param  {Boolean} isTouchEnd [是否是touchEnd，如果是touchEnd的话，获取会有一些特殊]
         * @return {Object}             [pageX的父对象]
         */
        _getTouchPos : function( event, isTouchEnd ){
            return $.support.touch ? isTouchEnd ? event.originalEvent.changedTouches[ 0 ] : event.originalEvent.touches[ 0 ] : event;
        }
    });
    return BaseEvent;
});