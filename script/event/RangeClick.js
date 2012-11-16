
/**
 * 一个单击事件，如果从按下到弹起，X轴或者Y轴的距离超过阀值，或者按住的时间超过阀值，则不会触发此事件。
 * 可在外面单独处理touchStart，move和stop事件，在构造函数中通过cfg参数传入。
 */
define( function( require, exports, model ){
    "use strick";

    require( './BaseEvent' );
    Ext.define( "RangeClick", {
        extend : "BaseEvent",

        //竖向位移默认值
        _verSliderThreshold  : 5,
        
        //横向位移默认值
        _horSliderThreshold  : 5,
        
        //按下时间默认值
        _sliderTimeThreshold : 200,

        //触发rangeClick时所执行的函数
        _rangeClick          : function(){},

        _touchInfo : {
            startTime : null,
            startPos  : {
                x : null,
                y : null
            }
        },

        touchStart : function( event ){
            var touchInfo = this._touchInfo, 
                evtPos    = this._getTouchPos( event );
            touchInfo.startTime = event.timeStamp;
            touchInfo.startPos  = {
                x : evtPos.pageX,
                y : evtPos.pageY
            };
            this._touchStart( event );
        },

        touchMove : function( event ){
            var touchInfo = this._touchInfo,
                evtPos    = this._getTouchPos( event ),
                disPos    = {
                    x : evtPos.pageX - touchInfo.startPos.x,
                    y : evtPos.pageY - touchInfo.startPos.y
                };
            this._touchMove( event, disPos );
        },

        touchStop : function( event ){
            var touchInfo = this._touchInfo,
                evtPos = this._getTouchPos( event, true ),
                disTime, disPos;
            disTime    = event.timeStamp - touchInfo.startTime;
            disPos     = {
                x : evtPos.pageX - touchInfo.startPos.x,
                y : evtPos.pageY - touchInfo.startPos.y
            };
            Math.abs( disPos.x ) <= this._verSliderThreshold && Math.abs( disPos.y ) <= this._horSliderThreshold 
                && disTime <= this._sliderTimeThreshold && this._rangeClick( event ) || this._touchStop( event, disPos );
        }
    });

    return RangeClick;
});