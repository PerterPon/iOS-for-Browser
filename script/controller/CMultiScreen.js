
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CMultiScreen', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'activeDot' ],
                [ 'sliderDown' ],
                [ 'sliderMove' ],
                [ 'sliderUp' ],
                [ 'translate' ]
            ]
        },

        EactiveDot : function( idx ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                view  = sttc.view;
            Util.notify( view, 'activeDot', [ idx ] );
        },

        EsliderDown : function( event ){
            var sttc  = this.values,
                sttcs = this.self,
                model = sttc.model,
                Util  = sttcs.Util; 
            Util.notify( model, 'sliderDown', [ event ] ); 
        },

        EsliderMove : function( event ){
            var sttc  = this.values,
                sttcs = this.self,
                model = sttc.model,
                Util  = sttcs.Util; 
            Util.notify( model, 'sliderMove', [ event ] );
        },

        EsliderUp : function( event ){
            var sttc  = this.values,
                sttcs = this.self,
                model = sttc.model,
                Util  = sttcs.Util; 
            Util.notify( model, 'sliderUp', [ event ] );
        },

        Etranslate : function( x, y ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                view  = sttc.view;
            Util.notify( view, 'translate', [ x, y ] );
        }

    });

    return CMultiScreen;
});