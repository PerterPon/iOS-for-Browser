
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'BootScreen', {
        extend : 'BaseModel'
    });

    return BootScreen;
});