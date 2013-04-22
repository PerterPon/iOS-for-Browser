
define( function( require, exports, module ) {
    // "use strict";

    require( '../../view/BaseView' );
    Ext.define( "BaseTopBar", {
        extend : 'BaseView',

        inheritableStatics : {
            manager   : require( './TopBarManager' ),
            leftCls   : 'iOS_topBar_leftBtn',
            centerCls : 'iOS_topBar_centerTitle',
            rightCls  : 'iOS_topBar_rightBtn',
            btns      : [ 'leftBtnCfg', 'centerTittle', 'rightBtnCfg' ]
        },

        constructor : function() {
            this.callParent( arguments );
            this._initBtns();
        },

        _initBtns : function() {
            var btns = this.self.btns,
                sttc = this.values,
                that = this;
            btns.forEach( function( value, index ) {
                sttc[ value ] && that._doGenerateBtn( sttc[ value ][ 'type' ] , sttc[ value ] );
            } );
        },

        _doGenerateBtn : function( type, cfg ) {
            var btn;
            this[ '_generateBtn' + type ] && ( btn = this[ 'generateBtn' + type.toUpperCase() ]( cfg ) );
            this._getEl().append( btn );
        },

        /**
         * [_generateBtnRound 生成圆角状的按钮]
         * @return {[Dom Object]}
         */
        _generateBtnROUND : function( cfg ) {
            var sttcs  = this.self,
                sttc   = this.values,
                dir    = cfg[ 'direction' ],
                canvas = document.createElement( 'canvas' );
            canvas.classList.add( sttc[ dir +'Cls' ] );
            
            return canvas;
        },

        /**
         * [_generateBtnArrow 生成箭头状的按钮]
         * @return {[Dom Object]}
         */
        _generateBtnARROW : function( cfg ) {
            var sttcs   = this.self,
                dir     = cfg[ 'direction' ],
                canvas  = document.createElement( 'canvas' );
            canvas.classList.add( sttc[ dir +'Cls' ] );
            return canvas;
        },

        /**
         * [_generateBtnTitle 生成一个没有任何图形背景的标题]
         * @param  {[type]} cfg [description]
         * @return {[Dom Object]}
         */
        _generateBtnTitle :function( cfg ) {
            var sttcs   = this.self,
                dir     = cfg[ 'direction' ],
                span    = document.createElement( 'span' );
            span.classList.add( sttc[ dir +'Cls' ] );
            return span;
        }
    } );

    return BaseTopBar;
} );