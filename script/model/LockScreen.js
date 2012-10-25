﻿
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'LockScreen', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderMove' ],
                [ 'sliderUp' ],
                [ 'unlockComplete' ]
            ],
            Event : window.iOS.Event
        },

        statics : {
            slider   : null,
            sliderImg: null,
            startPos : null,
            sliding  : false
        },

        constructor : function( cfg ){
            this.callParent( [ cfg ] );
            this.__updateTime();
        },

        /**
         * [__updateTime 更新时间]
         * @return {void}
         */
        __updateTime : function(){
            var sttc = this.self,
                that = this,
                Event= sttc.Event;
            setInterval( function(){
                var date  = new Date(),
                    time  = {
                        year   : date.getFullYear(),
                        month  : date.getMonth() + 1,
                        day    : date.getDate(),
                        weekDay: date.getDay(),
                        hours  : date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
                        minute : date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
                        second : date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
                    };
                Event.dispatchEvent( 'updateTime', [ time ]);
                date = time = null;
            }, 10000 );
        },

        /**
         * [__getTouchPos 获得鼠标或者触摸点信息]
         * @param  {Event} event      [事件对象]
         * @param  {Bool}  isTouchEnd [touchend实践或者pageX的方式较为特殊]
         * @return {Object}
         */
        __getTouchPos : function( event, isTouchEnd ){
            return $.support.touch ? isTouchEnd ? event.originalEvent.touches[ 0 ] : event.originalEvent.changedTouches[ 0 ] : event;
        },

        __unlockHandler : function(){
            var sttc = this.self,
                ctrl = sttc.controller,
                Util = sttc.Util;
            Util.notify( ctrl, 'unlock' );
        },

        _attachEventListener : function(){
            this.callParent();
            var sttc  = this.self,
                Event = sttc.Event;
            Event.addEvent( 'unlock', this.__unlockHandler, this );
        },

        EsliderDown : function( event ){
            var sttc   = this.self,
                evtPos = this.__getTouchPos( event ); 
            sttc.startPos = evtPos.pageX;
            sttc.sliding  = true;
        },

        EsliderMove : function( event ){
            var sttc   = this.self,
                evtPos = this.__getTouchPos( event ),
                Util   = sttc.Util,
                Ctrl   = sttc.controller,
                distance;
            distance = evtPos.pageX - sttc.startPos;
            if( distance <= 0 ){
                Util.notify( Ctrl, 'sliderTranslate', [ 0, 0 ] );
                return;
            }
            if( distance >= 207 ){
                Util.notify( Ctrl, 'sliderTranslate', [ 207, 0 ] );
                return;
            }
            Util.notify( Ctrl, 'sliderTranslate', [ distance, 0 ] );
            delete sttc;
            delete evtPos;
            delete distance;
        },

        EsliderUp   : function( event ){
            var sttc   = this.self,
                Util   = sttc.Util,
                Ctrl   = sttc.controller;
                evtPos = this.__getTouchPos( event );
            if( evtPos.pageX - sttc.startPos < 207 && evtPos.pageX - sttc.startPos > 0 ){
                Util.notify( Ctrl, 'sliderBack' );
            } else {
                var Event = sttc.Event;
                Event.dispatchEvent( 'unlock' );
            }
            sttc.sliding = false;
        },

        EunlockComplete : function(){
            var sttc  = this.self,
                Event = sttc.Event;
            Event.dispatchEvent( 'iconIn' );
        }

    });

    return LockScreen;
});