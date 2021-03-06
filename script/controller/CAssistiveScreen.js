
define( function( require, exports, module ){
    //"use strict";

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
                [ 'showAssistiveOptionsComplete' ],
                [ 'hideAssistiveOptions' ],
                [ 'enableTransparent' ],
                [ 'disableTransparent' ],
                [ 'renderChild' ],
                [ 'assistiveOptionsClick' ],
                [ 'assistiveFuncIconClick' ],
                [ 'assistiveHideComplete' ]
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

        EshowAssistiveOptions : function( position, sceondaryIcon ){
            this.self.Util.notify( this.values.view, 'showAssistiveOptions', [ position, sceondaryIcon ] );
        },

        EshowAssistiveOptionsComplete : function() {
            this.self.Util.notify( this.values.model, 'showAssistiveOptionsComplete' );
        },

        EhideAssistiveOptions : function( position, sceondaryIcon ){
            this.self.Util.notify( this.values.view, 'hideAssistiveOptions', [ position, sceondaryIcon ] );
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

        EassistiveOptionsClick : function( event ){
            this.self.Util.notify( this.values.model, 'assistiveOptionsClick', [ event ] );
        },

        EassistiveFuncIconClick : function( event ) {
            this.self.Util.notify( this.values.model, 'assistiveFuncIconClick', [ event ] );
        },

        EassistiveHideComplete : function() {
            this.self.Util.notify( this.values.model, 'assistiveHideComplete' );
        }

    });

    return CAssistiveScreen;
});