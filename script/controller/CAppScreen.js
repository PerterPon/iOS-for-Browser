
define( function( require, exports, module ){
    //"use strict";

    require( './BaseController' );
    Ext.define( 'CAppScreen', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'openApp' ],
                [ 'closeApp' ]
            ]
        },

        EopenApp : function(){
            this.self.Util.notify( this.values.view, 'openApp' );
        },

        EcloseApp : function(){
            this.self.Util.notify( this.values.view, 'closeApp' );
        }

    });

    return CAppScreen;
});