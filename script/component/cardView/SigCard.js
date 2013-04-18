
define( function( require, exports, modules ) {
    // "use strict";

    Ext.define( "SigCard", {

        extend : 'BaseView',

        inheritableStatics : {
            baseClass : 'iOS_sigCard',
            manager   : require( './CardManager' )
        },

        _cfg : null,

        values : {
            //sigCard里的item
            itemPool : {}
        },

        constructor : function( cfg ) {
            this.callParent( [ cfg ] );
            this.__initCard();
            this._cfg    = cfg;
            this._parent = parent;
            this._getEl();
        },

        addItems : function( name, item ) {
            this.values[ 'itemPool' ][ name ] = item;
        },

        __initCard : function() {
            this.self.baseClass && ( this._getEl().addClass( this.self.baseClass ) );
        }
    } );

    return SigCard;

} );