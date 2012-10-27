
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CIconScreen', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'unlock' ]
            ]
        },

        Eunlock : function(){
            var sttc  = this.values,
                sttcs = this.self;
            sttcs.Util.notify( sttc.view, 'unlock' );
        }

    });

    return CIconScreen;
});