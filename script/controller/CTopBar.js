
define( function( require, exports, module ){
    "use strict";

    require( './BaseController' );
    Ext.define( 'CTopBar', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'updateTime' ],
                [ 'hideTopbar' ],
                [ 'topBarBlack' ],
                [ 'rollBackTopbar' ]
            ]
        },

        EupdateTime : function( time ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                view  = sttc.view;
            Util.notify( view, 'updateTime', [ time ] );
        },

        EhideTopbar : function(){
            this.self.Util.notify( this.values.view, 'hideTopbar' );
        },

        ErollBackTopbar : function(){
            this.self.Util.notify( this.values.view, 'rollBackTopbar' );
        },

        EtopBarBlack : function(){
            this.self.Util.notify( this.values.view, 'topBarBlack' );
        }

    });

    return CTopBar;
});