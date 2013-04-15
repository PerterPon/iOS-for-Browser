
define( function( require, exports, module ) {
    "use strict";

    require( './BaseController' );
    Ext.define( 'CMaskScreen', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'showMask' ],
                [ 'hideMask' ],
                [ 'maskClick' ]
            ]
        },

        EshowMask : function( suspendedName ) {
            this.self.Util.notify( this.values.view, 'showMask', [ suspendedName ] );
        },

        EhideMask : function() {
            this.self.Util.notify( this.values.view, 'hideMask' );
        },

        EmaskClick : function() {
            this.self.Util.notify( this.values.model, 'maskClick' );
        }
    } );

    return CMaskScreen;

} );