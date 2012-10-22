
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
                [ 'iconOut' ]
            ]
        },

        Eunlock : function(){
            var sttc = this.self;
            sttc.Util.notify( sttc.view, 'unlock' );
        },

        EinitComplete : function( inPos, outPos ){
            var sttc = this.self;
            sttc.Util.notify( sttc.view, 'initComplete', [ inPos, outPos ] );
        },

        EiconIn : function(){
            var sttc = this.self;
            sttc.Util.notify( sttc.view, 'iconIn' );
        },

        EiconOut : function(){
            var sttc = this.self;
            sttc.Util.notify( sttc.view, 'iconOut' );
        }

    });

    return CIcon;
});