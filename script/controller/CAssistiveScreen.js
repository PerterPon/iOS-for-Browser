
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
                [ 'assistivePointAutoTranslateComplete' ],
                [ 'showAssistiveOptions' ],
                [ 'hideAssistiveOptions' ],
                [ 'enableTransparent' ],
                [ 'disableTransparent' ],
                [ 'renderChild' ],
                [ 'assistiveOptionsClick' ]
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
        },

        EshowAssistiveOptions : function( position, assistiveAreaPos, assistivePos ){
            this.self.Util.notify( this.values.view, 'showAssistiveOptions', [ position, assistiveAreaPos, assistivePos ] );
        },

        EhideAssistiveOptions : function(){
            this.self.Util.notify( this.values.view, 'hideAssistiveOptions');
        },

        EdisableTransparent : function(){
            this.self.Util.notify( this.values.view, 'disableTransparent' );
        },

        EenableTransparent : function(){
            this.self.Util.notify( this.values.view, 'enableTransparent' );
        },

        ErenderChild : function( renderData ){
            this.self.Util.notify( this.values.view, 'renderChild', [ renderData ] );
        },

        EassistiveOptionsClick : function( event, assistiveNode ){
            this.self.Util.notify( this.values.model, 'assistiveOptionsClick', [ event, assistiveNode ] );
        }

    });

    return CAssistiveScreen;
});