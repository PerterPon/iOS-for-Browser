
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'Icon', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'touchStart' ],
                [ 'touchEnd' ],
                [ 'dragStart' ],
                [ 'dragMove' ],
                [ 'dragEnd' ],
                [ 'dragAutoTranslateComplete' ]
            ]
        },

        statics : {
            //当按下x方向或者y方向超过此距离，或者按住的时间超过sliderTimeThreshold，就不会触发单击事件。
            verSliderThreshold : 5,
            horSliderThreshold : 5,
            sliderTimeThreshold: 100,
            durationThreshold  : 750,
            /**
             * [scaleMultiple 当拖动icon时，icon的放大倍数]
             * @type {Number}
             */
            scaleMultiple      : 1.2,
            /**
             * [iconOutDisThreshold 当icon的x方向或者y方向被拖动此数值的距离之后，就会触发changeIconPosition事件]
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
            shaking       : false,
            touchStartHandleFun : null,
            touchEndHandleFun   : null,
            dragStartHandleFun  : null,
            dragMoveHandleFun   : null,
            dragEndHandleFun    : null,
            dragAutoTranslating : false
        },

        EtouchStart : function( event ){
            this.values.touchStartHandleFun( event );
        },

        EtouchEnd : function( event ){
            this.values.touchEndHandleFun( event );
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
            sttc.touchEndHandleFun   = fucs[ 'touchEnd' ];
            sttc.dragStartHandleFun  = dragFucs[ 'dragStart' ];
            sttc.dragMoveHandleFun   = dragFucs[ 'dragMove' ];
            sttc.dragEndHandleFun    = dragFucs[ 'dragEnd' ];
            sttcs.Util.notify( sttc.controller, 'initComplete', [ sttc.inPos, sttc.outPos ] );
        },

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'iconOut', this.__iconOut, this );
            Event.addEvent( 'iconIn', this.__iconIn, this );
            Event.addEvent( 'startShake', this.__startShakeHandle, this );
            Event.addEvent( 'stopShake', this.__stopShakeHandle, this );
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
                posY   = Math.floor( index / 4 ),
                disX   = 17 * ( posX + 1 ) + 58 * posX + 3 * Math.floor( posX.toString( 2 ) / 10 ),
                disY   = posY * 82 + ( posY & 2 ) * 4 + 10,
                System = window.iOS.System;
            return {
                x : disX / 320 * System.width,
                y : disY / 480 * System.height
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
            Util.notify( ctrl, 'stopShake' );
        },

        __changeIconPosition : function( curIdx, operation ){
            var sttc = this.values;
            if( sttc.index <= curIdx || sttc.dock )
                return;
            operation == 'out' ? sttc.index-- : sttc.index++;
            this.__calPosition();
            this.self.Util.notify( sttc.controller, 'changePosition', [ sttc.inPos ] );
        },

        __getTouchStartEndFun : function(){
            var startTime, handleFun, startPos,
                sttcs   = this.self,
                holding = false,
                Event   = window.iOS.Event,
                that    = this,
                sttc    = this.values,
                Util    = this.self.Util,
                ctrl    = sttc.controller,
                tapTimeOut;
            return {
                'touchStart' : touchStart,
                'touchEnd'   : touchEnd
            };

            function touchStart( event ){
                var evtPos = that._getTouchPos( event );
                Util.notify( ctrl, 'showShadeLayer' );
                holding    = true;
                startPos   = {
                    x : evtPos.pageX,
                    y : evtPos.pageY
                };
                startTime  = ( new Date() ).getTime();
                setTimeout( function(){
                    if( !holding || ( new Date() ).getTime() - startTime < sttcs.durationThreshold )
                        return;
                    sttc.shaking = true;
                    Event.dispatchEvent( 'startShake' );
                    Util.notify( ctrl, 'shadeLayerTransparent' );
                }, sttcs.durationThreshold );
                if( !sttc.shaking )
                    document.body.addEventListener( $.support.touchstop, bodyTouchStop );
                function bodyTouchStop(){
                    var nowTime = new Date();
                    document.body.removeEventListener( $.support.touchstop, bodyTouchStop );
                    if( nowTime.getTime() - startTime > sttcs.sliderTimeThreshold ){
                        setTimeout( function(){
                            if( !sttc.shaking )
                                Util.notify( ctrl, 'hideShadeLayer' );
                        }, 500 );
                    }
                }
            }

            function touchEnd( event ){
                var nowTime = new Date(),
                    evtPos  = that._getTouchPos( event, true ),
                    nowPos  = {
                        x : evtPos.pageX,
                        y : evtPos.pageY
                    },
                    timeDis = nowTime.getTime() - startTime,
                    horDis  = nowPos.x - nowPos.x,
                    verDis  = nowPos.y - nowPos.y;
                holding     = false;    
                if( horDis <= sttcs.horSliderThreshold && verDis <= sttcs.verSliderThreshold && timeDis <= sttcs.sliderTimeThreshold ){
                    // setTimeout( function(){
                    //     if( sttc.shaking )
                    //     Util.notify( ctrl, 'hideShadeLayer' );   
                    // }, 500 );
                    Event.dispatchEvent( 'iconOut' ); 
                    return;
                }
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
                    Event.dispatchEvent( 'changeIconPosition', [ sttc.index, 'out' ] );
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
