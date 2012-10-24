
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CLockScreen', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderMove' ],
                [ 'sliderUp' ],
                [ 'unlock' ],
                [ 'sliderTranslate' ],
                [ 'sliderBack' ]
            ]
        },

        EsliderDown : function( event ){
            var sttc    = this.self,
                model   = sttc.model,
                Util    = sttc.Util; 
            Util.notify( model, 'sliderDown', [ event ] ); 
        },

        EsliderMove : function( event ){
            var sttc    = this.self,
                model   = sttc.model,
                Util    = sttc.Util;
            Util.notify( model, 'sliderMove', [ event ] );
        },

        EsliderUp : function( event ){
            var sttc    = this.self,
                model   = sttc.model,
                Util    = sttc.Util; 
            Util.notify( model, 'sliderUp', [ event ] );
        },

        Eunlock : function(){
            var sttc    = this.self,
                view    = sttc.view,
                Util    = sttc.Util;
            Util.notify( view, 'unlock' );
        },

        sliderTranslate : function( x, y ){
            var sttc    = this.self,
                view    = sttc.view,
                Util    = sttc.util;
            Util.notify( view, 'sliderTranslate', [ x, y ] );
        },

        sliderBack : function(){
            var sttc    = this.self,
                view    = sttc.view,
                Util    = sttc.util;
            Util.notify( view, 'sliderTranslate' );
        }

    });

    return CLockScreen;
});