
define( function( require, exports, module ){
    "use strick";

    var Swip = require( '../event/Swip' );
    require( './BaseModel' );
    Ext.define( 'Content', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderMove' ],
                [ 'sliderUp' ]
            ]
        },

        statics : {
            width : window.iOS.System.width
        },

        values  : {
            startPos : null,
            sliding  : false,
            lastPos  : null,
            curIdx   : null,
            notSwipe : false,
            swipeStartTime : null,
            translating    : false,
            touchInstance  : null
        },

        EsliderDown : function( event ){
            this.values.touchInstance.touchStart( event );
        },

        EsliderMove : function( event ){
            this.values.touchInstance.touchMove( event );
        },

        EsliderUp   : function( event ){
            this.values.touchInstance.touchStop( event );
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
                    "clsList"  : [ "iOS_iconScreen_appIcon", "iOS_iconScreen_appIcon_" + i, false == i && "iOS_iconScreen_current" ],
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
                ctrl  = sttc.controller,
                touchFuncs = this.__getTouchStartStopFunc();
            Util.notify( ctrl, 'activeDot', [ sttc.curIdx ] );
            sttc.touchInstance = new Swip( touchFuncs );
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
        },

        __getTouchStartStopFunc : function(){
            var sttc  = this.values,
                sttcs = this.self,
                that  = this,
                Event = window.iOS.Event;
            return {
                touchStart  : touchStart,
                touchMove   : touchMove,
                touchStop   : touchStop,
                swip        : swip
            };

            function touchStart( event ){
                if( sttc.translating )
                    return;
            }

            function touchMove( event, disInfo ){
                var disX    = disInfo.disPos.x,
                    disTime = disInfo.disTime;
                if( !sttc.notSwipe ){
                    if( disTime >= sttcs.durationThreshold )
                        //如果按下时间或者按下移动的距离超过阀值，那么就不是swip，后续move不再监听swip。
                        sttc.notSwipe = true;
                }
                if( boundaryScreen( disX ) ){
                    disX *= 0.5;
                    //边界屏幕判定
                    if( disX >= sttcs.width / 2 - 10 )
                        return;
                }
                Event.dispatchEvent( 'multiScreenTranslate', [ sttc.curIdx, disX >= 0 ? 'right' : 'left', disX ]);
            }

            function touchStop( event, disInfo ){
                var disX      = disInfo.disPos.x,
                    disTime   = disInfo.disTime,
                    absDisX   = Math.abs( disX ),
                    direction = disX >= 0 ? 'right' : 'left';
                that.__doMultiScreenAutoTranslate( boundaryScreen( disX ), direction, absDisX );
            }

            function swip( event, disInfo ){
                var disX      = disInfo.disPos.x,
                    absDisX   = Math.abs( disX ),
                    direction = disX >= 0 ? 'right' : 'left';
                if( boundaryScreen( disX ) ){
                    //触发了swip事件，但是当前为边界屏幕判定。
                    that.__doMultiScreenAutoTranslate( boundaryScreen( disX ), direction, absDisX, true );
                    return true;
                }
                //满足条件，触发swip事件
                Event.dispatchEvent( 'multiScreenAutoTranslate', [ sttc.curIdx, direction, sttcs.width, true ] );
                sttc.translating    = true;
                sttc.notSwipe       = false;
                sttc.sliding        = false;
                return true;
            }

            function boundaryScreen( disX ){
                return ( !sttc.curIdx && disX > 0 ) || ( sttc.curIdx == sttc.data.data.length - 1 && disX < 0 );
            }
        }
    });

    return Content;
});