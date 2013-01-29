
define( function( require, exports, module ){
    "use strict";

    require( './BaseController' );
    Ext.define( 'CDockIcon', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'showBorder' ],
                [ 'hideBorder' ]
            ]
        },

        EshowBorder : function(){
            this.self.Util.notify( this.values.view, 'showBorder' );
        },

        EhideBorder : function(){
            this.self.Util.notify( this.values.view, 'hideBorder' );
        }

    });

    return CDockIcon;
});