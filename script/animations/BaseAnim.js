
define( function( require, exports, module ){
    //"use strict";
    
    Ext.define( "BaseAmin", {
        constructor : function() {
            this._initCardView();
        },

        _cardsMap : {},

        /**
         * [_initCardView 初始化]
         * @return {[void]} []
         */
        _initCardView : function() {
            this._cardsMap = {};
        },

        addCard : function( cards ) {
            if( 'object' === typeof cards && !cards.length ) {
                
            }
        }
    } );

    return BaseAmin;
} );