
define( function( require, exports, modules ) {

    require( '../../BaseManager' );
    Ext.define( 'ListManager', {
        extend : 'BaseManager'

    } );
     
    var listMngr = new ListManager( 'list' ),
        Util     = require( '../../../util/Util' );

    return {
        register : Util.bind( listMngr.register, listMngr ),
        get      : Util.bind( listMngr.get, listMngr )
    };
} );