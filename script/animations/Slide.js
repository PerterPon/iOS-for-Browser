
define( function( require, exports, module ) {
    // "use strict";

    require( './BaseAnim' );
    Ext.define( "Slide", {
        extend : 'BaseAnim'
    } );

    return Slide;
} );