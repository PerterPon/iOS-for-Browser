
define( function( require, exports, module ){
    "use strick";

    require( 'BaseModel' );
    Ext.define( 'BaseIOS', {
        extend : 'BaseModel'

        constructor : function( cfg ){
            this.callParent([ cfg ]);

        },
        
        __initBackground : function(){
            
        }
    });

    return BaseIOS;
});