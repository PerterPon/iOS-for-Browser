
define( function( require, exports, module ){
    //"use strict";

    require( '../Component' );
    Ext.define( 'BaseController', {
        extend : 'Component',

        manager : require( './ControllerManager' ),

        values : {
            view  : null,
            model : null
        },

        constructor : function( cfg ){
            this._clearValues();
            this._applyCfg( cfg );
            this._registerSelf();
        },

        /**
         * [setView 设置biew]
         * @param {Object} view [view]
         */
        setView : function( view ){
            this.valuess.view = view;
        },

        /**
         * [setModel 设置model]
         * @param {Model} model [model]
         */
        setModel : function( model ){
            this.values.model = model;
        },

        /**
         * [setMV 设置ctrl的model和view]
         * @param {Object} model [model]
         * @param {Object} view  [view]
         */
        setMV : function( model, view ){
            var sttc   = this.values;
            sttc.model = model;
            sttc.view  = view;
            this._init(); 
        },

        _clearValues : function(){
            this.values = {};
        },

        _init : function(){
            this._attachEventListener();
        }

    });

    return BaseController;
});