
define( function( require, exports, module ){
    //"use strict";

    require( '../BaseManager' );
    Ext.define( 'ModelManager', {
        extend : 'BaseManager'

    });

    var modelMgr = new ModelManager( 'model' ),
        Util     = require( '../../util/Util' );
        
    return {
        register : Util.bind( modelMgr.register, modelMgr ),
        get      : Util.bind( modelMgr.get, modelMgr )
    };

});