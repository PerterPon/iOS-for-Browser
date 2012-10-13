
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CLockScreen', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderMove' ],
                [ 'sliderUp' ]
            ]
        },

        EsliderDown : function( event ){
            var sttc    = this.self,
                model   = sttc.model,
                Util    = sttc.Util,
                manager = sttc.manager; 
            Util.notify( model, 'sliderDown', [ event ] ); 
        },

        EsliderMove : function( event ){
            var sttc    = this.self,
                model   = sttc.model,
                Util    = sttc.Util,
                manager = sttc.manager;
            Util.notify( model, 'sliderMove', [ event ] );
        },

        EsliderUp : function( event ){
            var sttc    = this.self,
                model   = sttc.model,
                Util    = sttc.Util,
                manager = sttc.manager; 
            Util.notify( model, 'sliderUp', [ event ] );
        }

    });

    return CLockScreen;
});