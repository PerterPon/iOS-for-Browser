
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'AppIcon', {
        extend : 'BaseModel',

        statics : {
            Event : window.iOS.Event
        }

    });

    return AppIcon;
});