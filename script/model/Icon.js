
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
                [ 'dragEnd' ]
            ]
        },

        statics : {
            verSliderThreshold : 5,
            horSliderThreshold : 5,
            sliderTimeThreshold: 100,
            durationThreshold  : 750
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
            holdStartTime : null,
            touchStartHandleFun : null,
            touchEndHandleFun   : null,
            dragStartHandleFun  : null,
            dragMoveHandleFun   : null,
            dragEndHandleFun    : null
        },

        EtouchStart : function( event ){
            this.values.touchStartHandleFun( event );
        },

        EtouchEnd : function( event ){
            this.values.touchEndHandleFun( event );
        },

        EdragStart : function( event ){

        },

        EdragMove : function( event ){

        },

        EdragEnd : function( event ){

        },

        _initComplete : function(){
            var sttc  = this.values,
                sttcs = this.self,
                fucs  = this.__getTouchStartEndFun();
            this.__calPosition();
            sttc.touchStartHandleFun = fucs[ 'touchStart' ];
            sttc.touchEndHandleFun   = fucs[ 'touchEnd' ];
            sttcs.Util.notify( sttc.controller, 'initComplete', [ sttc.inPos, sttc.outPos ] );
        },

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'iconOut', this.__iconOut, this );
            Event.addEvent( 'iconIn', this.__iconIn, this );
            Event.addEvent( 'startShake', this.__startShakeHandle, this );
            Event.addEvent( 'stopShake', this.__stopShakeHandle, this );
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

        __getTouchStartEndFun : function( gesture ){
            var startTime, handleFun, startPos,
                sttcs   = this.self,
                holding = false,
                Event   = window.iOS.Event,
                that    = this,
                tapTimeOut;
            return {
                'touchStart' : touchStart,
                'touchEnd'   : touchEnd
            };

            function touchStart( event ){
                var evtPos = that._getTouchPos( event );
                holding    = true;
                startPos   = {
                    x : evtPos.pageX,
                    y : evtPos.pageY
                };
                startTime = ( new Date() ).getTime();
                setTimeout( function(){
                    if( !holding || ( new Date() ).getTime() - startTime < sttcs.durationThreshold )
                        return;
                    Event.dispatchEvent( 'startShake' );
                }, sttcs.durationThreshold );
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
                    Event.dispatchEvent( 'iconOut' ); 
                    return;
                }
            }
        }
    });
    
    return Icon;
});
