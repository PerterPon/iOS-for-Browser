
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
        },

        /**
         * [setMV 设置ctrl的model和view]
         * @param {Object} model [model]
         * @param {Object} view  [view]
         */
        setMV : function( model, view ){
            var sttc   = this.self;
            sttc.model = model;
            sttc.view  = view;
            this._init(); 
        },

        _init : function(){
            // this.addEventListener();
        }

    });

    return BaseController;
});