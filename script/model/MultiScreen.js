
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'Content', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderMove' ],
                [ 'sliderUp' ],
                [ 'swipe' ]
            ]
        },

        statics : {
            width : window.iOS.System.width,
            durationThreshold           : 200,
            horizontalDistanceThreshold : 20
        },

        values  : {
            startPos : null,
            sliding  : false,
            lastPos  : null,
            curIdx   : null,
            notSwipe : false,
            swipeStartTime : null,
            translating    : false
        },

        EsliderDown : function( event ){
            var sttc   = this.values;
            if( sttc.translating )
                return;
            var evtPos = this._getTouchPos( event );
            sttc.startPos = evtPos.pageX;
            sttc.sliding  = true;
            sttc.swipeStartTime = event.timeStamp;
        },

        EsliderMove : function( event ){
            var sttc   = this.values;
            if( !sttc.sliding || sttc.translating )
                return;
            var sttcs  = this.self,
                evtPos = this._getTouchPos( event ),
                Event  = window.iOS.Event,
                dis    = evtPos.pageX - sttc.startPos,
                nowTime;
            if( !sttc.notSwipe ){
                nowTime = event.timeStamp;
                if( nowTime - sttc.swipeStartTime >= sttcs.durationThreshold )
                    sttc.notSwipe = true;
                // return;
            }
            sttc.lastPos    = evtPos.pageX;
            if( ( !sttc.curIdx && dis > 0 ) || ( sttc.curIdx == sttc.data.data.length - 1 && dis < 0 ) ){
                dis *= 0.5;
                if( dis >= sttcs.width / 2 - 10 )
                    return;
            }
            Event.dispatchEvent( 'multiScreenTranslate', [ sttc.curIdx, dis >= 0 ? 'right' : 'left', dis ]);
            delete sttc;
            delete evtPos;
            delete distance;
            delete nowTime;
        },

        EsliderUp   : function( event ){
            var sttc   = this.values;
            if( sttc.translating )
                return;
            var sttcs  = this.self,
                evtPos = this._getTouchPos( event, true ),
                ctrl   = sttc.controller,
                Util   = sttcs.Util,
                Event  = window.iOS.Event,
                dis    = evtPos.pageX - sttc.startPos,
                absDis = Math.abs( dis ),
                direction = dis >= 0 ? 'right' : 'left',
                boundaryScreen = ( ( !sttc.curIdx && dis > 0 ) || ( sttc.curIdx == sttc.data.data.length - 1 && dis < 0 ) ),
                nowTime, disTime, distance;
            if( !sttc.notSwipe ){
                nowTime = event.timeStamp;
                disTime = nowTime - sttc.swipeStartTime; 
                if( disTime < sttcs.durationThreshold && absDis > sttcs.horizontalDistanceThreshold ){
                    if( ( !sttc.curIdx && dis > 0 ) || ( sttc.curIdx == sttc.data.data.length - 1 && dis < 0 ) ){
                        this.__doMultiScreenAutoTranslate( boundaryScreen, direction, absDis, true );
                        return;
                    }
                    Event.dispatchEvent( 'multiScreenAutoTranslate', [ sttc.curIdx, direction, sttcs.width, true ] );
                    sttc.translating    = true;
                    sttc.notSwipe       = false;
                    this.values.sliding = false;
                    return;
                }
            }
            this.__doMultiScreenAutoTranslate( boundaryScreen, direction, absDis );
        },

        Eswipe : function( direction ){
            var sttc     = this.values,
                sttcs    = this.self,
                Event    = window.iOS.Event
            Event.dispatchEvent( 'multiScreenAutoTranslate', [ sttc.curIdx, direction, sttcs.width, true ] );
        },

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'multiScreenAutoTranslateComplete', this.__multiScreenAutoTranslateComplete, this );
        },

        _handleChildCfg : function(){
            var sttc     = this.values,
                data     = sttc.data.data,
                curIdx   = typeof data[ 0 ] == 'object' ? 0 : data.shift(),
                AppIcon  = require( './AppIcon' ),
                CAppIcon = require( '../controller/CAppIcon' ),
                VAppIcon = require( '../view/VAppIcon' ),
                newCfg   = [];
            sttc.curIdx  = curIdx;
            for( var i   = 0; i < data.length; i++ ){
                newCfg.push({
                    "class"    : AppIcon,
                    "name"     : "appIcon_" + i,
                    "clsList"  : [ "iOS_iconScreen_appIcon", "iOS_iconScreen_appIcon_" + i, false == i ? "iOS_iconScreen_current" : "" ],
                    "controller"  : CAppIcon,
                    "view"     : VAppIcon,
                    "renderChild" : true,
                    "index"    : i,
                    "current"  : i == curIdx,
                    "data"     : {
                        "data" : data[ i ]
                    }
                });
            }
            sttc.data.data = newCfg;
        },

        _initComplete : function(){
            this.callParent();
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller;
            Util.notify( ctrl, 'activeDot', [ sttc.curIdx ] );
        },

        /**
         * [__multiScreenAutoTranslateComplete 屏幕滑动完成后的事件处理函数]
         * @param  {Number} curPos [当前屏幕的translate值，当为0的时候就表示是当前显示屏幕，激活显示点]
         * @param  {Number} curIdx [当前屏幕的index值，若translate为0，则index的值会被multiScreen保存]
         * @return {void}
         */
        __multiScreenAutoTranslateComplete : function( curPos, curIdx ){
            if( 0 == curPos ){
                var sttc  = this.values,
                    sttcs = this.self,
                    Util  = sttcs.Util,
                    ctrl  = sttc.controller;
                sttc.curIdx = curIdx;
                Util.notify( ctrl, 'activeDot', [ curIdx ] );
            }
            this.values.translating = false;
        },

        /**
         * [__doMultiScreenAutoTranslate 鼠标或手指松开时候的事件处理函数，由此派发事件]
         * @param  {Boolean}  boundaryScreen [是否为边界屏幕]
         * @param  {String}   direction      [当前运动的方向]
         * @param  {Number}   distance       [当前已经运动的距离]
         * @param  {Boolean}  isSwip         [当前是否是swip事件]
         * @return {void}
         */
        __doMultiScreenAutoTranslate : function( boundaryScreen, direction, distance, isSwip ){
            if( !boundaryScreen && isSwip )
                return;
            var sttc  = this.values,
                sttcs = this.self,
                Event = window.iOS.Event;
            if( boundaryScreen ){
                distance *= 0.5;
                if( distance >= sttcs.width / 2 - 10 )
                    distance = sttcs.width / 2 - 10;
            }
            Event.dispatchEvent( 'multiScreenAutoTranslate', [ sttc.curIdx, direction , distance ] );
            sttc.notSwipe    = false;
            sttc.sliding     = false;
            sttc.translating = true;
        }
    });

    return Content;
});