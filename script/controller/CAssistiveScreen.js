
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CAssistiveScreen', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'showAssistivePoint' ],
                [ 'touchstart' ],
                [ 'touchmove' ],
                [ 'touchstop' ],
                [ 'translate' ],
                [ 'assistivePointAutoTranslate' ],
                [ 'assistivePointAutoTranslateComplete' ]
            ]
        },

        EshowAssistivePoint : function(){
            this.self.Util.notify( this.values.view, 'showAssistivePoint' );
        },

        Etouchstart : function( event ){
            this.self.Util.notify( this.values.model, 'touchstart', [ event ] );
        },

        Etouchmove : function( event ){
            this.self.Util.notify( this.values.model, 'touchmove', [ event ] );
        },

        Etouchstop : function( event ){
            this.self.Util.notify( this.values.model, 'touchstop', [ event ] );
        },

        Etranslate : function( position ){
            this.self.Util.notify( this.values.view, 'translate', [ position ] );
        },

        EassistivePointAutoTranslate : function( position ){
            this.self.Util.notify( this.values.view, 'assistivePointAutoTranslate', [ position ] );
        },

        EassistivePointAutoTranslateComplete : function(){
            this.self.Util.notify( this.values.model, 'assistivePointAutoTranslateComplete' );
        }

    });

    return CAssistiveScreen;
});