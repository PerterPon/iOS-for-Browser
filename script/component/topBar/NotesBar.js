
define( function( require, exports, moduls ) {
    "use strict";

    require( './BaseTopBar' );
    Ext.define( "NotesBar", {
        extend : 'BaseTopBar'
    } );

    return NotesBar;
} );