
define( function( require, exports, moduls ) {
    "use strict";

    require( './BaseTopBar' );
    Ext.define( "NotesBar", {
        extend : 'BaseTopBar',

        statics : {
            baseClass : 'iOS_notes_topBar'
        }
    } );

    return NotesBar;
} );