
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
            ]
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
                that = this;
            setInterval( function(){
                var date = new Date(),
                    day  = 
            }, 10000 );
        },

        EsliderDown : function( event ){
            var sttc = this.self;
            sttc.slider   = event.target;
            sttc.sliderImg= sttc.slider.parentElement.getElementsByClassName( sttc.sliderImgCls )[ 0 ];
            sttc.startPos = event.pageX;
            sttc.sliding  = true;
        },

        EsliderMove : function( event ){
            var sttc = this.self,
                distance;
            if( !sttc.slider || !sttc.sliding )
                return;
            distance = event.pageX - sttc.startPos;
            if( distance <= 0 ){
                sttc.slider.style.webkitTransform = 'translate3d( 0, 0, 0 )';
                return;
            }
            if( distance >= 207 ){
                sttc.slider.style.webkitTransform = 'translate3d( 207px, 0, 0 )';
                return;
            }
            sttc.sliderImg.style.opacity = 1 - distance / 120;
            sttc.slider.style.webkitTransform = 'translate3d('+ ( event.pageX - sttc.startPos )+'px, 0, 0 )';
        },

        EsliderUp   : function( event ){
            var sttc   = this.self,
                slider = sttc.slider,
                sliderImg = sttc.sliderImg; 
            if( event.pageX - sttc.startPos < 207 && event.pageX - sttc.startPos > 0 ){
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

            }
            sttc.sliding = false;
        }

    });

    return LockScreen;
});