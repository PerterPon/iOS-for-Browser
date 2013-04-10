
define( function( require, exports, module ) {
    // "use strict";

    require( '../../view/BaseView' );
    Ext.define( "BaseTopBar", {
        extend : 'BaseView',

        inheriteableStatics : {
            manager        : require( './TopBarManager' ),
            leftBtnCls     : 'iOS_topBar_leftBtn',
            centerTitleCls : 'iOS_topBar_centerTitle',
            rightBtnCls    : 'iOS_topBar_rightBtn' 
        },

        //不注册到vm里去
        _registerSelf : function() {},

        /**
         * [_initLeftBtn 初始化左侧按钮]
         * @return {[vois]}
         */
        _initLeftBtn : function() {
            var btnCfg = this.leftBtnCfg;
        },

        /**
         * [_initCenterText 初始化工具栏中间文字]
         * @return {[void]}
         */
        _initCenterText : function() {
        },

        /**
         * [_initRightBtn 初始化右侧按钮]
         * @return {[void]}
         */
        _initRightBtn : function() {
            var btnCfg = this._rightBtnCfg;
        },

        _doGenerateBtn : function( type, cfg ) {
            this[ 'generateBtn' + type ] && ( this[ 'generateBtn' + type ]( cfg ) );
        },

        /**
         * [_generateBtnRound 生成圆角状的按钮]
         * @return {[jQuery Dom Object]}
         */
        _generateBtnRound : function() {
            var sttcs   = this.self,
                $canvas = $( '<canvas class="'+ sttcs.leftBtnCfg +'"></canvas>' );

        },

        /**
         * [_generateBtnArrow 生成箭头状的按钮]
         * @return {[void]}
         */
        _generateBtnArrow : function() {

        }

    } );

    return BaseTopBar;
} );