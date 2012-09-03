
define(function(require, exports, module){
    "use strict";

    Ext.define( 'ModuleManager', function(){

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