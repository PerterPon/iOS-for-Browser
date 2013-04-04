
define( function( require, exports, module ) {
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