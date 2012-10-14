
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'LockScreen', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderMove' ],
                [ 'sliderUp' ]
            ],
            Event : window.iOS.Event
        },

        statics : {
            slider   : null,
            sliderImg: null,
            sliderImgCls : 'iOS_lockScreen_sliderImg',
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
                        hours  : date.getHours(),
                        minute : date.getMinutes(),
                        second : date.getSeconds()
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
            sttc.slider   = evtPos.target;
            sttc.sliderImg= sttc.slider.parentElement.getElementsByClassName( sttc.sliderImgCls )[ 0 ];
            sttc.startPos = evtPos.pageX;
            sttc.sliding  = true;
        },

        EsliderMove : function( event ){
            var sttc   = this.self,
                evtPos = this.__getTouchPos( event ), 
                distance;
            if( !sttc.slider || !sttc.sliding )
                return;
            distance = evtPos.pageX - sttc.startPos;
            if( distance <= 0 ){
                sttc.slider.style.webkitTransform = 'translate3d( 0, 0, 0 )';
                return;
            }
            if( distance >= 207 ){
                sttc.slider.style.webkitTransform = 'translate3d( 207px, 0, 0 )';
                return;
            }
            sttc.sliderImg.style.opacity = 1 - distance / 120;
            sttc.slider.style.webkitTransform = 'translate3d('+ ( evtPos.pageX - sttc.startPos )+'px, 0, 0 )';
        },

        EsliderUp   : function( event ){
            var sttc   = this.self,
                slider = sttc.slider,
                sliderImg = sttc.sliderImg,
                evtPos = this.__getTouchPos( event );
            if( evtPos.pageX - sttc.startPos < 207 && evtPos.pageX - sttc.startPos > 0 ){
                slider.style.webkitTransitionDuration = '300ms';
                slider.style.webkitTransform = 'translate3d( 0, 0, 0 )';
                sliderImg.style.webkitTransitionDuration = '300ms';
                sliderImg.style.opacity = '1';
                slider.addEventListener( 'webkitTransitionEnd', function(){
                    slider.style.webkitTransitionDuration = '0ms';
                    sliderImg.style.webkitTransitionDuration = '0ms';
                    slider.removeEventListener( 'webkitTransitionEnd' );
                });
            } else {
                var Event = sttc.Event;
                Event.dispatchEvent( 'unlock' );
            }
            sttc.sliding = false;
        }

    });

    return LockScreen;
});