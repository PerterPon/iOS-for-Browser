
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'DockIcon', {
        extend : 'BaseModel',

        statics : {
            Event : window.iOS.Event
        }

    });

    return DockIcon;
});