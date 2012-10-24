
define( function( require, exports, module ){
    "use strick";

    require( './IconContent' );
    Ext.define( 'DockIcon', {
        extend : 'IconContent',

        statics : {
            dock : true
        }

    });

    return DockIcon;
});