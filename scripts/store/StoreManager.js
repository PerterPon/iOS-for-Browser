
define(function(require, exports, module){
    "use strict";

    Ext.define( 'StoreManager', {

        getStore : function( name ){
            return this.get( name );
        }

    });

    var storeMngr = new StoreManager( 'store' );

    return {
        register : storeMngr.register,
        getStore : storeMngr.getStore
    };

}); 