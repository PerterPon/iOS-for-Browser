
define( function( require, exports, module ){
    "use strick";

    require( '../BaseManager' );
    Ext.define( 'ViewManager', {
        extend : 'BaseManager'

    });

    var viewMngr = new ViewManager( 'view' ),
        Util     = require( '../../util/Util' );

    return {
        register : Util.bind( viewMngr.register, viewMngr ),
        get      : Util.bind( viewMngr.get, viewMngr )
    };

}); 