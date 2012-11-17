
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

        //range标识，若在移动中有一项条件不满足range事件，则此值会变为true，并且执行_rangeMove函数。
        _rangeMoved          : false,

        _rangeMove           : function(){},

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
            this._rangeMoved    = false;
        },

        touchMove : function( event ){
            var touchInfo = this._touchInfo,
                evtPos    = this._getTouchPos( event ),
                disPos    = {
                    x : evtPos.pageX - touchInfo.startPos.x,
                    y : evtPos.pageY - touchInfo.startPos.y
                };
            if( !this._rangeMoved && ( Math.abs( disPos.x ) > this._horSliderThreshold || Math.abs( disPos.y ) > this._verSliderThreshold ) ){
                this._rangeMove( disPos );
                this._rangeMoved = true;
            }
            this._touchMove( event, disPos );
        },

        touchStop : function( event ){
            var touchInfo = this._touchInfo,
                evtPos = this._getTouchPos( event, true ),
                that   = this,
                disTime, disPos;
            disTime    = event.timeStamp - touchInfo.startTime;
            disPos     = {
                x : evtPos.pageX - touchInfo.startPos.x,
                y : evtPos.pageY - touchInfo.startPos.y
            };
            !this._rangeMoved && Math.abs( disPos.x ) <= that._verSliderThreshold && Math.abs( disPos.x ) <= that._verSliderThreshold && Math.abs( disPos.y ) <= that._horSliderThreshold
                && disTime <= that._sliderTimeThreshold && that._rangeClick( event ) || that._touchStop( event, disPos );
        }
    });

    return RangeClick;
});