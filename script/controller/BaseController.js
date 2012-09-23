
define( function( require, exports, module ){
    "use strick";

    require( '../Component' );
    Ext.define( 'BaseController', {

        constructor : function( cfg ){
            this.callParent([ cfg ]);
        }

    });

    return BaseController;
});