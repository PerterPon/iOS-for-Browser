
define( function( require, exports, module ){
    //"use strict";

    require( '../BaseManager' );
    Ext.define( 'ControllerManager', {
        extend : 'BaseManager'
    });

    var ctrlMgr = new ControllerManager( 'controller' ),
        Util    = require( '../../util/Util' );

    return {
        register : Util.bind( ctrlMgr.register, ctrlMgr ),
        get      : Util.bind( ctrlMgr.get, ctrlMgr )
    };

});