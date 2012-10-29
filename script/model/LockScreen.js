
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
            ]
        },
        
        values : {
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
                Event= window.iOS.Event;
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
         * @param  {Bool}  isTouchEnd [touchend事件获得pageX的方式较为特殊]
         * @return {Object}
         */
        __getTouchPos : function( event, isTouchEnd ){
            return $.support.touch ? isTouchEnd ? event.originalEvent.touches[ 0 ] : event.originalEvent.changedTouches[ 0 ] : event;
        },

        __unlockHandler : function(){
            var sttc  = this.values,
                sttcs = this.self, 
                ctrl  = sttc.controller,
                Util  = sttcs.Util;
            Util.notify( ctrl, 'unlock' );
        },

        _attachEventListener : function(){
            this.callParent();
            var Event  = window.iOS.Event;
            Event.addEvent( 'unlock', this.__unlockHandler, this );
        },

        EsliderDown : function( event ){
            var sttc   = this.values,
                evtPos = this.__getTouchPos( event ); 
            sttc.startPos = evtPos.pageX;
            sttc.sliding  = true;
        },

        EsliderMove : function( event ){
            var sttc   = this.values,
                sttcs  = this.self,
                evtPos = this.__getTouchPos( event ),
                Util   = sttcs.Util,
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

        EsliderUp : function( event ){
            var sttc   = this.values,
                sttcs  = this.self,
                Util   = sttcs.Util,
                Ctrl   = sttc.controller;
                evtPos = this.__getTouchPos( event );
            if( evtPos.pageX - sttc.startPos < 207 ){
                Util.notify( Ctrl, 'sliderBack' );
            } else {
                var Event = window.iOS.Event;
                Event.dispatchEvent( 'unlock' );
            }
            sttc.sliding = false;
        },

        EunlockComplete : function(){
            var Event = window.iOS.Event;
            Event.dispatchEvent( 'unlockComplete' );
            setTimeout( function(){
                Event.dispatchEvent( 'iconIn' );
            }, 1 );
            
        }

    });

    return LockScreen;
});