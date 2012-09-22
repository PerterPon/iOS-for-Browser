
define( function( require, exports, module ){
    "use strick";

    require( '../BaseManager' );
    Ext.define( 'ModelManager', {
        extend : 'BaseManager',

        getModel : function( name ){
            return this.get( name );
        }

    });

    var modelMgr = new ModelManager( 'module' ),
        Util     = require( '../../util/Util' );

    return {
        register : Util.bind( modelMgr.register, modelMgr ),
        getModel : Util.bind( modelMgr.getModel, modelMgr )
    };

});