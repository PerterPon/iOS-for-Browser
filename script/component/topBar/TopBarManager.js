
define( function( require, exports, modules ) {

    require( '../../BaseManager' );
    Ext.define( 'TopBarManager', {
        extend : 'BaseManager'
    } );
     
    var topBarMngr = new TopBarManager( 'card' ),
        Util       = require( '../../../util/Util' );

    return {
        register : Util.bind( topBarMngr.register, topBarMngr ),
        get      : Util.bind( topBarMngr.get, topBarMngr )
    };
} );