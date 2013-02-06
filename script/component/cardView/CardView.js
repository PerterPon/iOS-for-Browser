
define( function( require, exports, module ){
    //"use strict";

    var Aminations = require( '../../animations/Anim' );
    Ext.define( 'CardView', {
        constructor : function( cfg ) {
            this._cfg = cfg;
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

        /**
         * [_initCardView 初始化]
         * @return {[void]} []
         */
        _initCardView : function() {
            
            this._cardsMap = {};
        },

        _initAnim : function() {
            this._amin = new Aminations( {
                width  : window.iOS.System.width,
                height : window.iOS.System.height 
            } );
        },

        /**
         * [addCard 向本card中添加card]
         * @param {[Object||Array]} cards [需要被添加的card]
         */
        addCard : function( cards ) {
            var cardsMap = {};
            for( var i in cards ) {
                cardsMap[ i ] = cards[ i ];
            }
            this._cardsMap = cardsMap;
        },

        /**
         * [clearCard 清除card信息]
         * @return {[]}
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
         * [active 切换acrd]
         * @param  {[String]} name      [被切换的card名称]
         * @param  {[String]} direction [切换方向]
         * @param  {[String]} animType  [切换动画类型]
         * @return {[void]}
         */
        active : function( name, direction, animType, curCallBack, tarCallBack ) {
            animType = animType || 'slide';
            this._tarCard = _cardsMap[ name ];
            if( !this._tarCard ) {
                return;
            }
            _amin.doAnim( this._curCard, this._tarCard, direction, animType, curCallBack, tarCallBack );
        }
    } );

    return CardView;
} );