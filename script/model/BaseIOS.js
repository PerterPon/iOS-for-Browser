
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'BaseIOS', {
        extend : 'BaseModel'
    });

    return BaseIOS;
});