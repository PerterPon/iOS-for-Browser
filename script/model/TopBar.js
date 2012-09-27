
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'TopBar', {
        extend : 'BaseModel'
    });

    return TopBar;
});