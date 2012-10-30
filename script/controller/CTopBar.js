
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CTopBar', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'updateTime' ]
            ]
        },

        EupdateTime : function( time ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                view  = sttc.view;
            Util.notify( view, 'updateTime', [ time ] );
        }

    });

    return CTopBar;
});