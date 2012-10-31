
define( function( require, exports, module ){
    "use strick";

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
                [ 'touchEnd' ],
                [ 'startShake' ],
                [ 'stopShake' ],
                [ 'dragStart' ],
                [ 'dragMove' ],
                [ 'dragEnd' ]
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
            sttcs.Util.notify( sttc.view, 'dragStart', [ event ] );
        },

        EdragMove : function( event ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.model, 'dragMove', [ event ] );
        },

        EdragEnd : function( event ){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttcs.model. 'dragEnd', [ event ] );
        }

    });

    return CIcon;
});