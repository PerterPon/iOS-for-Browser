
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
                [ 'renderChild' ]
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

        EshowAssistiveOptions : function(){
            this.self.Util.notify( this.values.view, 'showAssistiveOptions' );
        },

        EhideAssistiveOptions : function(){

        },

        EdisableTransparent : function(){
            this.self.Util.notify( this.values.view, 'disableTransparent' );
        },

        EenableTransparent : function(){
            this.self.Util.notify( this.values.view, 'enableTransparent' );
        },

        ErenderChild : function( renderData ){
            this.self.Util.notify( this.values.view, 'renderChild', [ renderData ] );
        }

    });

    return CAssistiveScreen;
});