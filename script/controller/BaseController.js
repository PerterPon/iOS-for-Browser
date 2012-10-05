
define( function( require, exports, module ){
    "use strick";

    require( '../Component' );
    Ext.define( 'BaseController', {

        constructor : function( cfg ){
            this.callParent([ cfg ]);
        },

        /**
         * [setView 设置biew]
         * @param {Object} view [view]
         */
        setView : function( view ){
            this.self.view = view;
        },

        /**
         * [setModel 设置model]
         * @param {Model} model [model]
         */
        setModel : function( model ){
            this.self.model = model;
        }

    });

    return BaseController;
});