
define( function( require, exports, modules ) {
    // "use strict";

    Ext.define( "SigCard", {

        extend : 'BaseView',

        inheritableStatics : {
            baseClass : 'iOS_sigCard'
        },

        _cfg : null,

        /**
         * [_parent 父级元素，通常来说会是一个cardView]
         * @type {[CardView]}
         */
        _parent : parent,

        constructor : function( cfg, parent ) {
            this.callParent( [ cfg ] );
            this.__initCard();
            this._cfg    = cfg;
            this._parent = parent;
            this._registSelf();
            this._getEl();
        },

        __initCard : function() {
            this.self.baseClass && ( this._getEl().addClass( this.self.baseClass ) );
        },

        _registSelf : function() {
            this._parent && this._parent.registCard( this._cfg[ 'name' ], this );
        }
    } );

    return SigCard;

} );