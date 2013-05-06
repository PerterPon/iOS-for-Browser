
define( function( require, exports, modules ) {

    require( '../../BaseManager' );
    Ext.define( 'CardManager', {
        extend : 'BaseManager'
    } );
     
    var cardMngr = new CardManager( 'card' ),
        Util     = require( '../../../util/Util' ),
        register = Util.bind( cardMngr.register, cardMngr ),
        get      = Util.bind( cardMngr.get,      cardMngr );

    return {
        register : register,
        get      : get
    };
} );