
define( function( require, exports, module ) {
    //"use strict";
    require( '../../view/BaseView' );
    var Aminations = require( '../../animations/CardAnim' );
    Ext.define( 'CardView', {
        extend : 'BaseView',

        constructor : function( cfg ) {
            this.callParent( [ cfg ] );
            this._initCardView();
            this._initAnim();
        },

        inheritableStatics : {
            baseClass : 'iOS_cardView'
        },

        _cfg : {},

        _cardsMap : {},

        /**
         * [_amin 动画类对象]
         * @type {[type]}
         */
        _amin : null,

        /**
         * [_curCard 当前显示的card的名称]
         * @type {[type]}
         */
        _curCard : null,

        /**
         * [_tarCard 目标显示card的名称]
         * @type {[type]}
         */
        _tarCard : null,

        _registerSelf : function() {},

        /**
         * [_initCardView 初始化]
         * @return {[void]} []
         */
        _initCardView : function() {
            this.self.baseClass && this._getEl().addClass( this.self.baseClass );
            this._cardsMap = {};
        },

        _initAnim : function() {
            this._amin = new Aminations( {
                width  : window.iOS.System.width,
                height : window.iOS.System.height 
            } );
        },

        /**
         * [clearCard 清除card信息]
         * @return {}
         */
        clearCard : function() {
            this._cardsMap = {};
        },

        /**
         * [deleteCard 删除某个card]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        deleteCard : function( name ) {
            delete this._cardsMap[ name ];
        },

        /**
         * [addSigCard 添加sigCard]
         * @param {[type]} name      [description]
         * @param {[type]} sigCard   [description]
         * @param {[type]} isDefault [description]
         */
        addSigCard : function( name, sigCard, isDefault ) {
            this._cardsMap[ name ] = sigCard;
            isDefault && ( this._curCard = sigCard );
        },

        /**
         * [active 切换acrd]
         * @param  {[String]} name      [被切换的card名称]
         * @param  {[Object]} changeCfg [切换card时候的配置信息]
         * @return {[void]}
         */
        active : function( name, changeCfg ) {
            var tarCard     = this._cardsMap[ name ],
                curCard     = this._curCard,
                curCallBack = curCard.getChangedCallBack(),
                tarCallBack = tarCard.getChangedCallBack(),
                direction   = changeCfg.direction,
                animType    = changeCfg.animType || 'slide',
                that        = this;
            this._tarCard   = tarCard;
            if( !this._tarCard ) {
                return;
            }
            if( 'slide' === animType ) {
                if( 'right' === direction || 'left' === direction ) {
                    curCard.transparentTopBar( animType, direction );
                    tarCard.untransparentTopBar( animType, direction );
                } else if( 'top' === direction ) {
                    tarCard.values.cards.rightBtn.cardName = curCard.values.name;
                }
            }
            this._amin.doAnim( curCard.getEl(), tarCard.getEl(), direction, animType, curCallBack, tarCallBack, function() {
                that._curCard = tarCard;
            } );
        }

    } );

    return CardView;
} );