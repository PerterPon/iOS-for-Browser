
define( function( require, exports, module ){
    "use strict";

    require( './BaseController' );
    Ext.define( 'CIcon', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'unlock' ],
                [ 'initComplete' ],
                [ 'iconIn' ],
                [ 'iconOut' ],
                [ 'iconClick' ],
                [ 'touchStart' ],
                [ 'touchMove' ],
                [ 'touchEnd' ],
                [ 'startShake' ],
                [ 'stopShake' ],
                [ 'dragStart' ],
                [ 'dragMove' ],
                [ 'dragEnd' ],
                [ 'changePosition' ],
                [ 'showShadeLayer' ],
                [ 'hideShadeLayer' ],
                [ 'shadeLayerTransparent' ],
                [ 'shadeLayerBlack' ],
                [ 'dragStartTranslate' ],
                [ 'dragEndTranslate' ],
                [ 'dragAutoTranslateComplete' ]
            ]
        },

        Eunlock : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'unlock' );
        },

        EinitComplete : function( inPos, outPos ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'initComplete', [ inPos, outPos ] );
        },

        EiconIn : function( position ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'iconIn', [ position ] );
        },

        EiconOut : function( position ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'iconOut', [ position ] );
        },

        EtouchStart : function( event ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.model, 'touchStart', [ event ] );
        },

        EtouchMove : function( event ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.model, 'touchMove', [ event ] );
        },

        EtouchEnd : function( event ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.model, 'touchEnd', [ event ] );
        },

        EstartShake : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'startShake' );
        },

        EstopShake : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'stopShake' );
        },

        EdragStart : function( event ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.model, 'dragStart', [ event ] );
        },

        EdragMove : function( event ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.model, 'dragMove', [ event ] );
        },

        EdragEnd : function( event ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.model, 'dragEnd', [ event ] );
        },

        EchangePosition : function( position ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'changePosition', [ position ] );
        },

        EshowShadeLayer : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'showShadeLayer' );
        },

        EhideShadeLayer : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'hideShadeLayer' );
        },

        EshadeLayerTransparent : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'shadeLayerTransparent' );
        },

        EshadeLayerBlack : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'shadeLayerBlack' );
        },

        EdragStartTranslate : function( scaleMultiple ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'dragStartTranslate', [ scaleMultiple ] );
        },

        EdragEndTranslate : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'dragEndTranslate' );
        },

        EdragAutoTranslateComplete : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.model, 'dragAutoTranslateComplete' );
        }

    });

    return CIcon;
});