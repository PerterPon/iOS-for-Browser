
define( function( require, exports, module ) {
    //"use strict";

    require( './BaseController' );
    Ext.define( 'CAppScreen', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'openApp' ],
                [ 'closeApp' ],
                [ 'clearApp' ],
                [ 'reopenApp' ]
            ]
        },

        EopenApp : function( appname ) {
            this.self.Util.notify( this.values.view, 'openApp', [ appname ] );
        },

        EcloseApp : function() {
            this.self.Util.notify( this.values.view, 'closeApp' );
        },

        EclearApp : function() {
            this.self.Util.notify( this.values.view, 'clearApp' );
        },

        EreopenApp : function( DOMObject ) {
            this.self.Util.notify( this.values.view, 'reopenApp', [ DOMObject ] );
        }

    });

    return CAppScreen;
});