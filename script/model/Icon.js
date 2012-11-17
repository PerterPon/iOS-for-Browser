
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    var RangeClick = require( '../event/RangeClick' );
    Ext.define( 'Icon', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'touchStart' ],
                [ 'touchMove' ],
                [ 'touchEnd' ],
                [ 'dragStart' ],
                [ 'dragMove' ],
                [ 'dragEnd' ],
                [ 'dragAutoTranslateComplete' ]
            ]
        },

        statics : {
            durationThreshold  : 750,
            /**
             * [scaleMultiple 当拖动icon时，icon的放大倍数]
             * @type {Number}
             */
            scaleMultiple      : 1.2,
            /**
             * [iconOutDisThreshold 抖动状态下，当icon的x方向或者y方向被拖动此数值的距离之后，就会触发changeIconPosition事件]
             * @type {Number}
             */
            iconOutDisThreshold: 40,
            /**
             * [iconInDisThreshold 当Icon进入某个Icon的x方向或者y方向此数值的距离之后，就会触发changeIconPosition事件]
             * @type {Number}
             */
            iconInDisThreshold : 20
        },

        values : {
            inPos  : {
                x  : null,
                y  : null
            },
            outPos : {
                x  : null,
                y  : null
            },
            tapTimeOut    : null,
            shaking       : false,
            touchStartHandleFun : null,
            touchMoveHandleFun  : null,
            touchEndHandleFun   : null,
            dragStartHandleFun  : null,
            dragMoveHandleFun   : null,
            dragEndHandleFun    : null,
            dragAutoTranslating : false,
            rangeClickInstance  : null
        },

        EtouchStart : function( event ){
            this.values.rangeClickInstance.touchStart( event );
        },

        EtouchMove : function( event ){
            this.values.rangeClickInstance.touchMove( event );
        },

        EtouchEnd : function( event ){
            this.values.rangeClickInstance.touchStop( event );
        },

        EdragStart : function( event ){
            this.values.dragStartHandleFun( event );
        },

        EdragMove : function( event ){
            this.values.dragMoveHandleFun( event );
        },

        EdragEnd : function( event ){
            this.values.dragEndHandleFun( event );
        },

        EdragAutoTranslateComplete : function(){
            this.values.dragAutoTranslating = false;
        },

        _initComplete : function(){
            var sttc     = this.values,
                sttcs    = this.self,
                fucs     = this.__getTouchStartEndFun(),
                dragFucs = this.__getDragStartEndFun();
            this.__calPosition();
            sttc.touchStartHandleFun = fucs[ 'touchStart' ];
            sttc.touchMoveHandleFun  = fucs[ 'touchMove' ];
            sttc.touchEndHandleFun   = fucs[ 'touchStop' ];
            sttc.dragStartHandleFun  = dragFucs[ 'dragStart' ];
            sttc.dragMoveHandleFun   = dragFucs[ 'dragMove' ];
            sttc.dragEndHandleFun    = dragFucs[ 'dragEnd' ];
            sttc.rangeClickInstance  = new RangeClick( fucs );
            sttcs.Util.notify( sttc.controller, 'initComplete', [ sttc.inPos, sttc.outPos ] );
        },

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'iconIn', this.__iconIn, this );
            Event.addEvent( 'iconOut', this.__iconOut, this );
            Event.addEvent( 'stopShake', this.__stopShakeHandle, this );
            Event.addEvent( 'startShake', this.__startShakeHandle, this );
            Event.addEvent( 'changeIconPosition', this.__changeIconPosition, this );
            Event.addEvent( 'multiScreenAutoTranslateComplete', this.__multiScreenAutoTranslateComplete, this );
        },

        /**
         * [__calPosition 计算图标的位置]
         * @return {}
         */
        __calPosition : function(){
            var sttc = this.values,
                idx  = sttc.index;
            sttc.inPos  = this.__getInPosition( idx );
            // window.iOS.Icon[ sttc.screenIdx ][ sttc.index ] = sttc.inPos;
            sttc.outPos = this.__getOutPosition( idx );
        },

        /**
         * [__getInPosition 获取图标在屏幕里面时候的位置]
         * @param  {Number} index [图标对应的index值，从上往下，从左往右]
         * @return {Object}       [相应的位置信息]
         */
        __getInPosition : function( index ){
            var posX   = index % 4,
                System = window.iOS.System,
                posY   = Math.floor( index / 4 ),
                widthTimes  = System.width / 320,
                heightTimes = System.height / 480,
                disX   = 17 * widthTimes * ( posX + 1 ) + 58 * widthTimes * posX + 3 * Math.floor( posX.toString( 2 ) / 10 ) * widthTimes,
                disY   = posY * 82 * heightTimes + ( posY & 2 ) * 4 * heightTimes + 10 * heightTimes;
            return {
                x : disX,
                y : disY
            };
        },

        /**
         * [__getOutPosition 获取图标在屏幕外面时候的位置]
         * @param  {Number} index [图标对应的index值，从上往下，从左往右]
         * @return {Object}       [相应的位置信息]
         */
        __getOutPosition : function( index ){
            var sttc   = this.values,
                posY   = Math.floor( index / 4 ),
                posX   = index % 4,
                posIn  = this._posIn,
                disX   = ( posX & 2 ) - 1,
                disY   = ( posY & 2 ) - 1,
                System = window.iOS.System;
            return {
                x : sttc.dock ? sttc.inPos.x : ( sttc.inPos.x + 160 * disX ) / 320 * System.width,
                y : sttc.dock ? 90 : ( sttc.inPos.y + 140 * disY ) / 480 * System.height
            };
        },

        __iconIn : function(){
            var sttc  = this.values,
                sttcs = this.self;
            if( sttc.current || sttc.dock )
                sttcs.Util.notify( sttc.controller, 'iconIn', [ sttc.inPos ] );
        },

        __iconOut : function(){
            var sttc  = this.values,
                sttcs = this.self;
            if( sttc.current || sttc.dock )
                sttcs.Util.notify( sttc.controller, 'iconOut', [ sttc.outPos ] );
        },

        __multiScreenAutoTranslateComplete : function( curPos, curIdx ){
            if( curPos )
                return;
            var sttc     = this.values;
            sttc.current = curIdx == sttc.screenIdx;
        },

        __startShakeHandle : function(){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller;
            Util.notify( ctrl, 'startShake' );
        },

        __stopShakeHandle : function(){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller;
            Util.notify( ctrl, 'hideShadeLayer' );
            Util.notify( ctrl, 'stopShake' );
        },

        __changeIconPosition : function( curIdx, operation, isOriIconDock ){
            var sttc = this.values;
            if( sttc.index <= curIdx || sttc.dock || !sttc.current || isOriIconDock )
                return;
            operation == 'out' ? sttc.index-- : sttc.index++;
            this.__calPosition();
            this.self.Util.notify( sttc.controller, 'changePosition', [ sttc.inPos ] );
        },

        __getTouchStartEndFun : function(){
            var startTime, handleFun,
                sttcs   = this.self,
                holding = false,
                Event   = window.iOS.Event,
                that    = this,
                sttc    = this.values,
                Util    = this.self.Util,
                ctrl    = sttc.controller,
                isTouchMove  = false,
                tapThreshold = {
                    x : 10,
                    y : 10
                },
                tapTimeOut;
            return {
                'touchStart' : touchStart,
                'touchMove'  : touchMove,
                'touchStop'  : touchStop,
                'rangeClick' : rangeClick,
                'rangeMove'  : rangeMove
            };

            function touchStart( event ){
                var evtPos = that._getTouchPos( event );
                Util.notify( ctrl, 'showShadeLayer' );
                holding    = true;
                isTouchMove= false;
                startTime  = event.timeStamp;
                //添加抖动定时器，不满足抖动条件的时候会被清除掉，一直不被清除则到时间后会触发抖动。
                tapTimeOut = setTimeout( function(){
                    if( !holding )
                        return;
                    sttc.shaking = true;
                    Util.notify( ctrl, 'shadeLayerTransparent' );
                    Event.dispatchEvent( 'startShake' );
                }, sttcs.durationThreshold );
            }

            function touchMove( event, disPos ){}

            function touchStop( event, disPos ){
                sttc.shaking ? event.stopPropagation() : !isTouchMove && rangeClick( event );
                holding     = false;
            }

            function rangeMove(){
                Util.notify( ctrl, 'shadeLayerTransparent' );
                Util.notify( ctrl, 'hideShadeLayer' );
                //判定为touchMove，清除抖动定时器。
                clearTimeout( tapTimeOut );
                isTouchMove = true;
            }

            function rangeClick( event ){
                Event.dispatchEvent( 'iconOut' );
                Event.dispatchEvent( 'openApp', [ true ] );
                //判定为单击事件，清除抖动定时器。
                clearTimeout( tapTimeOut );
                holding = false;
                //FIXME:为了更可靠，需要换成回调执行。
                setTimeout( function(){
                    Util.notify( ctrl, 'hideShadeLayer' );
                }, 500 );
            }
        },

        __getDragStartEndFun : function(){
            var sttc  = this.values,
                sttcs = this.self,
                that  = this,
                ctrl  = sttc.controller,
                Util  = sttcs.Util,
                Event = window.iOS.Event,
                curPosIn = true,
                dragging = false,
                startPos;
            return {
                'dragStart' : dragStart,
                'dragMove'  : dragMove,
                'dragEnd'   : dragEnd
            };

            function dragStart( event ){
                if( sttc.dragAutoTranslating )
                    return;
                dragging   = true;
                Util.notify( ctrl, 'stopShake' );
                Util.notify( ctrl, 'shadeLayerBlack' );
                Util.notify( ctrl, 'dragStartTranslate', [ sttcs.scaleMultiple ] )
                var evtPos = that._getTouchPos( event );
                startPos   = {
                    x : evtPos.pageX,
                    y : evtPos.pageY
                };
            }

            function dragMove( event ){
                if( !dragging )
                    return;
                var evtPos = that._getTouchPos( event ),
                    dis    = {
                        x : evtPos.pageX - startPos.x,
                        y : evtPos.pageY - startPos.y
                    },
                    absDis = {
                        x : Math.abs( dis.x ),
                        y : Math.abs( dis.y )
                    };
                Util.notify( ctrl, 'changePosition', [ {
                    x : sttc.inPos.x + dis.x,
                    y : sttc.inPos.y + dis.y
                } ] );
                if( ( dis.x > sttcs.iconOutDisThreshold || dis.y > sttcs.iconInDisThreshold ) && curPosIn ){
                    Event.dispatchEvent( 'changeIconPosition', [ sttc.index, 'out', sttc.dock ] );
                    curPosIn = false;
                }
            }

            function dragEnd( event ){
                if( !dragging )
                    return;
                dragging = false;
                curPosIn = true;
                Util.notify( ctrl, 'changePosition', [ sttc.inPos ] );
                Util.notify( ctrl, 'startShake' );
                Util.notify( ctrl, 'shadeLayerTransparent' );
                Util.notify( ctrl, 'dragEndTranslate' )
            }

        }
    });
    
    return Icon;
});
