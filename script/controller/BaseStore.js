
define( function( require, exports, module ){
    "use strict";

    var ctrlMngr  = require( './script/controller/StoreManager' );
    Ext.define( 'BaseController', {

        inheritableStatics : {
        },

        statics: {
        },

        constructor: function( name ){
            this._registStore( name, this );
            this._creatWebSocket();
        },

        _registStore: function( name, store ){
            strMngr.register( name, store );
        },

    });

    return BaseController;
});