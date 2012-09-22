
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'LockScreen', {
        extend : 'BaseModel'

    });

    return LockScreen;
});