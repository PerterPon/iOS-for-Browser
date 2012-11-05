
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CTopBar', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'updateTime' ],
                [ 'hideTopbar' ],
                [ 'showTopbar' ]
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

        EshowTopbar : function(){
            this.self.Util.notify( this.values.view, 'showTopbar' );
        }

    });

    return CTopBar;
});