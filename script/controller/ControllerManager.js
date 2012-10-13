
define( function( require, exports, module ){
    "use strick";

    require( '../BaseManager' );
    Ext.define( 'ControllerManager', {
        extend : 'BaseManager',

        /*getController : function( name ){
            return this.get( name );
        }*/

    });

    var ctrlMgr = new ControllerManager( 'module' ),
        Util    = require( '../../util/Util' );

    return {
        register : Util.bind( ctrlMgr.register, ctrlMgr ),
        get      : Util.bind( ctrlMgr.get, ctrlMgr )
    };

});