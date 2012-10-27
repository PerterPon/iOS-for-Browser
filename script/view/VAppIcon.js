
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VAppIcon', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'sliderTranslate' ]
            ]
        },

        EsliderTranslate : function( x, y ){
            var sttc   = this.values;
            sttc.slider[ 0 ].style.marginLeft = x + 'px'; 
        },

        _attachDomEvent : function(){
            var sttc  = this.values,
                sttcs = this.self,
                ctrl  = sttc.controller,
                Util  = sttcs.Util;
            sttc.slider = this._getEl().on( $.support.touchstart, function( event ){
                Util.notify( ctrl, 'sliderDown', [ event ] );
            }).on( $.support.touchmove, function( event ){
                Util.notify( ctrl, 'sliderMove', [ event ] )
            }).on( $.support.touchstop, function( event ){
                Util.notify( ctrl, 'sliderUp', [ event ] );
            });
        }
    });

    return VAppIcon;
});