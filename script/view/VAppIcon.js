
define( function( require, exports, module ) {
    //"use strict";

    require( './BaseView' );
    Ext.define( 'VAppIcon', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'translate' ],
                [ 'autoTranslate' ]
            ]
        },

        statics : {
            width : window.iOS.System.width
        },

        values  : {
            slider  : null,
            thisPos : null
        },

        Etranslate : function( x, y ) {
            var sttc  = this.values,
                sttcs = this.self;
            sttc.slider[ 0 ].style.webkitTransform = 'translate3d('+ x +'px, '+ y +'px, 0)'; 
        },

        EautoTranslate : function( tarPos, animTime ) {
            var sttc   = this.values,
                slider = sttc.slider[ 0 ],
                Event  = window.iOS.Event;
            slider.style.webkitTransitionDuration = animTime + 'ms';
            slider.style.webkitTransform = 'translate3d('+ tarPos +'px, 0, 0)';
            slider.addEventListener( 'webkitTransitionEnd', translateCompletedHandler );
            sttc.thisPos = tarPos;
            function translateCompletedHandler() {
                slider.style.webkitTransitionDuration = '0';
                Event.dispatchEvent( 'multiScreenAutoTranslateComplete', [ sttc.thisPos, sttc.cfg.index ] );
                slider.removeEventListener( 'webkitTransitionEnd', translateCompletedHandler );
            }
        },

        _initView : function() {
            this.callParent();
            var sttc       = this.values,
                sttcs      = this.self,
                current    = sttc.cfg.current,
                thisScreen = this._getEl();
            sttc.slider    = thisScreen;
            !current && ( thisScreen[ 0 ].style.webkitTransform = 'translate3d('+ sttcs.width +'px, 0, 0)' );  
        }
    });

    return VAppIcon;
});