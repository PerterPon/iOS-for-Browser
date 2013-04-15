﻿
define( function( require, exports, module ) {
    //"use strict";
    require( '../../view/BaseView' );
    var Aminations = require( '../../animations/Anim' );
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
        },

        /**
         * [registCard 注册下属card，此处采用向上注册法，每次下属card被实例化时，均会将自己注册到父级cardView上]
         * @param  {[type]} name [description]
         * @param  {[type]} card [description]
         * @return {[type]}      [description]
         */
        registCard : function( name, card ) {
            this._cardsMap[ name ] = card;
        }

    } );

    return CardView;
} );