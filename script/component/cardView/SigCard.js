
define( function( require, exports, modules ) {
    // "use strict";

    Ext.define( "SigCard", {

        extend : 'BaseView',

        inheritableStatics : {
            baseClass : 'iOS_sigCard'
        },

        _cfg : null,

        manager : require( './CardManager' ),

        /**
         * [sigCard 此sigCard所对应的cardView对象]
         * @type {[type]}
         */
        sigCard : null,

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

        /**
         * [addItems description]
         * @param {[type]} name [description]
         * @param {[type]} item [description]
         */
        addItems : function( name, item ) {
            this.values[ 'itemPool' ] || ( this.values[ 'itemPool' ] = {} );
            this.values[ 'itemPool' ][ name ] = item;
        },

        /**
         * [changeCard 切换card，由sigCard内部组件触发]
         * @return {[type]} [description]
         */
        changeCard : function( type, cfg ) {
            var sttc      = this.values,
                cards     = sttc.cards;
            if( cfg.callBack ) {
                this._changedCallBack = cfg.callBack;
                delete cfg.callBack;
            }
            sttc.cardView.active( cards[ type ], cfg );
        },

        setCardView : function( cardView ) {
            var sttc = this.values;
            sttc.cardView = cardView;
            cardView.addSigCard( sttc.name, this, sttc[ 'default' ] );
        },

        getChangedCallBack : function() {
            return this._changedCallBack;
        },

        _changedCallBack : function( showOrhide ) {},

        __initCard : function() {
            this.self.baseClass && ( this._getEl().addClass( this.self.baseClass ) );
        }
    } );

    return SigCard;

} );