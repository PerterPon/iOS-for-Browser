
define( function( require, exports, module ){
    "use strict";

    require( '../BaseManager' );
    var Util = require( '../../util/Util' );
    Ext.define( 'ModelManager', {
        extend : 'BaseManager',

        getModel : function( name ){
            return this.get( name );
        }

    });

    var modelMgr = new ModelManager( 'module' );

    return {
        register : Util.bind( modelMgr.register, modelMgr ),
        getModel : Util.bind( modelMgr.getModel, modelMgr )
    };

});