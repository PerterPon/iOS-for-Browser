
define( function( require, exports, model ){
    "use strict";

    Ext.define( 'BaseEvent', {

        //按下时所执行的函数
        _touchStart          : function(){},
        
        //移动时所执行的函数
        _touchMove           : function(){},

        //弹起时所执行的函数
        _touchStop           : function(){},

        _touchInfo           : {
            startPos : {
                x : null,
                y : null
            },
            startTime : null
        },

        constructor : function( cfg ){
            for( var i in cfg ){
                ( ( '_' + i ) in this ) && ( this[ '_' + i ] = cfg[ i ] );
            }
        },

        touchStart : function( event ){
            var evtPos      = this._getTouchPos( event );
            this._touchInfo = {
                startPos : {
                    x : evtPos.pageX,
                    y : evtPos.pageY
                },
                startTime : event.timeStamp
            }
        },

        touchMove : function( event ){},

        touchStop : function( event ){},

        /**
         * [_getTouchPos 根据具体的环境，获取pageX的父对象]
         * @param  {MouseEvent}  event  [事件对象]
         * @param  {Boolean} isTouchEnd [是否是touchEnd，如果是touchEnd的话，获取会有一些特殊]
         * @return {Object}             [pageX的父对象]
         */
        _getTouchPos : function( event, isTouchEnd ){
            return $.support.touch ? isTouchEnd ? event.originalEvent.changedTouches[ 0 ] : event.originalEvent.touches[ 0 ] : event;
        },

        _getDisInfo : function( event, isTouchEnd ){
            var touchInfo = this._touchInfo,
                evtPos    = this._getTouchPos( event, isTouchEnd );
            return {
                disPos : {
                    x : evtPos.pageX - touchInfo.startPos.x,
                    y : evtPos.pageY - touchInfo.startPos.y
                },
                disTime : event.timeStamp - touchInfo.startTime
            };
        }

    });
    return BaseEvent;
});