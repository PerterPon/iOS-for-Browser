
define( function( require, exports, module ){
    //"use strict";

    require( './BaseController' );
    Ext.define( 'CHome', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'homeButtonClick' ]
            ]
        },

        EhomeButtonClick : function(){
            this.self.Util.notify( this.values.model, 'homeButtonClick', this );
        }

    });

    return CHome;
});