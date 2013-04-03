
define( function( require, exports, modules ) {
    "use strict";

    Ext.define( "CNotesList", {
        extend : "BaseController",

        inheritableStatics : {
            eventList : [
                [ 'renderListData' ]
            ]
        },

        ErenderListData : function( listDom ) {
            this.self.Util.notify( this.values.view, 'renderListData', [ listDom ] );
        }
    } );

    return CNotesList;
} );