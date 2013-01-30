
define( function( require, exports, module ){
    //"use strict";

    require( './BaseView' );
    Ext.define( 'VIconScreen', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'unlock' ]
            ]
        },

        Eunlock : function(){
            this._getEl().show();
        }

    });

    return VIconScreen;
});