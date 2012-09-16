
define( function( require, exports, module ){
    "use strict";

    require( '../BaseManager' );
    Ext.define( 'ModuleManager', {
        extend : 'BaseManager',

        statics : {
            pool : [],
            pool2 : []
        },

        getModule : function( name ){
            return this.get( name );
        }

    });

    var moduleMgr = new ModuleManager( 'module' );

    return {
        register  : moduleMgr.register,
        getModule : moduleMgr.getModule
    };

});