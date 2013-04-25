
define( function( require, exports, module ) {
    "use strict";

    require( './BaseTopBar' );
    Ext.define( "NotesBar", {
        extend : 'BaseTopBar',

        centerCls : 'iOS_notes_topBar_centerTtile'
        
    } );

    return NotesBar;
} );