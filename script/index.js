
define( function( require, exports, module ){
    "use strick";
    
    var iterator = require( './Iterator' ),
        cfg      = require( './config/global' );
    iterator.setPreDom( 'iOS_system_content' );
    iterator.itrtrView( cfg );
});