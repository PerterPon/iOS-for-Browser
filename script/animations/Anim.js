
define( function( require, exports, modules ) {
    "use strict";

    require( './BaseAnim' );
    Ext.define( "Anim", {
        extend : BaseAnim
    } );

    return Anim;
} );