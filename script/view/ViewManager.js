
define(function(require, exports, module){
    "use strict";

    Ext.define( 'ViewManager', {
        
        getView : function( name ){
            return this.get( name );
        }

    });

    var viewMngr = new ViewManager( 'view' );

    return {
        register : viewMngr.register,
        getView  : viewMngr.getView
    };

}); 