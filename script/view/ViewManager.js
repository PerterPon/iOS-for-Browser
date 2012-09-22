
define( function( require, exports, module ){
    "use strick";

    require( '../BaseManager' );
    Ext.define( 'ViewManager', {
        extend : 'BaseManager',
        
        getView : function( name ){
            return this.get( name );
        }

    });

    var viewMngr = new ViewManager( 'view' ),
        Util     = require( '../../util/Util' );

    return {
        register : Util.bind( viewMngr.register, viewMngr ),
        getView  : Util.bind( viewMngr.getView, viewMngr )
    };

}); 