
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'AppScreen', {
        extend : 'BaseModel'

    });

    return AppScreen;
});