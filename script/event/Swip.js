
define( function( require, exports, model ){
    "use strict";

    require( './BaseEvent' );
    Ext.define( "Swip", {
        extend : BaseEvent,

        _touching  : false,

        // 被判定为swip事件后会执行的函数。
        _swip : function(){
            return true;
        },

        //移动的时间，若大于这个值，则不会被判定为swip。
        _durationThreshold : 200,

        //横向移动距离，若大于这个值，则不会被判定为swip。
        _horizontalDistanceThreshold : 20,

        _notSwip : false,

        _touchInfo : {
            startTime : null,
            startPos  : {
                x : null,
                y : null
            }
        },

        touchStart : function( event ){
            this.callParent( [ event ] );
            this._touchStart( event );
            this._touching = true;
            this._notSwip  = false;
        },

        touchMove : function( event ){
            if( !this._touching )
                return;
            var disInfo = this._getDisInfo( event );
            this._touchMove( event, disInfo );  
        },

        touchStop : function( event ){
            var disInfo    = this._getDisInfo( event, true );
            disInfo.disTime < this._durationThreshold && Math.abs( disInfo.disPos.x ) > this._horizontalDistanceThreshold
                && this._swip( event, disInfo ) || this._touchStop( event, disInfo );
            this._touching = false;
        }
    });

    return Swip;
});