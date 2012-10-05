
define( function( require, exports, module ){
    "use strick";

    require( '../BaseManager' );
    Ext.define( 'ControllerManager', {
        extend : 'BaseManager',

        getController : function( name ){
            return this.get( name );
        }

    });

    var ctrlMgr = new ControllerManager( 'module' ),
        Util    = require( 'Util' );

    return {
        register      : Util.bind( ctrlMgr.register, ctrlMgr ),
        getController : Util.bind( ctrlMgr.getController, ctrlMgr )
    };

});