
define( function( require, exports, module ){
    "use strick";

    require( '../BaseManager' );
    Ext.define( 'ModelManager', {
        extend : 'BaseManager'

    });

    var modelMgr = new ModelManager( 'module' ),
        Util     = require( '../../util/Util' );

    return {
        register : Util.bind( modelMgr.register, modelMgr ),
        get      : Util.bind( modelMgr.get, modelMgr )
    };

});