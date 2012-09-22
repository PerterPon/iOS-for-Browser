
define( function( equire, exports, module ){
    "use strick";

    Ext.define( 'StoreManager', {

        getStore : function( name ){
            return this.get( name );
        }

    });

    var storeMngr = new StoreManager( 'store' ),
        Util      = require( '../../util/Util' );

    return {
        register : Util.bind( storeMngr.register, storeMngr ),
        getStore : Util.bind( storeMngr.getStore, storeMngr )
    };

});