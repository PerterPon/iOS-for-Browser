
define( function( require, exports, module ) {
    // "use strict";

    require( '../../view/BaseView' );
    Ext.define( "BaseTopBar", {
        extend : 'BaseView',

        inheritableStatics : {
            baseClass : 'iOS_toolBar',
            manager   : require( './TopBarManager' ),
            leftCls   : 'iOS_topBar_leftBtn',
            centerCls : 'iOS_topBar_centerTitle',
            rightCls  : 'iOS_topBar_rightBtn'
        },

        constructor : function() {
            this.callParent( arguments );
            this._initBtns();
        },

        _initBtns : function() {
            var sttc = this.values,
                that = this,
                btns = sttc.btns;
            btns.forEach( function( value, index ) {
                that._doGenerateBtn( value[ 'type' ], value );
            } );
        },

        _doGenerateBtn : function( type, cfg ) {
            var btn;
            type = type.toUpperCase();
            this[ '_generateBtn' + type ] && ( btn = this[ '_generateBtn' + type ]( cfg ) );
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
            canvas.classList.add( this[ dir +'Cls' ] );
            canvas.classList.add( sttcs[ dir +'Cls' ] );
            this._creatBtn( canvas, cfg );
            return canvas;
        },

        /**
         * [_generateBtnArrow 生成箭头状的按钮]
         * @return {[Dom Object]}
         */
        _generateBtnARROW : function( cfg ) {
            var sttcs   = this.self,
                sttc    = this.values,
                dir     = cfg[ 'direction' ],
                canvas  = document.createElement( 'canvas' );
            canvas.classList.add( sttcs[ dir +'Cls' ] );
            canvas.classList.add( this[ dir +'Cls' ] );
            this._creatBtn( canvas, cfg );
            return canvas;
        },

        /**
         * [_generateBtnTitle 生成一个没有任何图形背景的标题]
         * @param  {[type]} cfg [description]
         * @return {[Dom Object]}
         */
        _generateBtnTITLE :function( cfg ) {
            var sttcs   = this.self,
                sttc    = this.values,
                dir     = cfg[ 'direction' ],
                span    = document.createElement( 'span' );
            span.classList.add( this[ dir +'Cls' ] );
            span.classList.add( sttcs[ dir +'Cls' ] );
            span.textContent = cfg[ 'text' ];
            return span;
        },

        _creatBtn: function( canvas, cfg ){
            var sttc     = this.self,
                ctx      = canvas.getContext('2d'),
                shape    = cfg.type,
                content  = cfg.text,
                fontSize = cfg.fontSize || 12,
                btnLeft, btnRight, img, contentLen = 0, adjust = 0;
            //稍微留白调整
            contentLen += 3;
            img        = new Image();
            if( cfg.pressed ) {
                shape += '_pressed';
            }
            img.src    = './resource/images/component/bars/' + shape + '.png';
            img.onload = function() {
                ctx.clearRect( 0, 0, canvas.width, canvas.height );
                ctx.font         = fontSize + 'px Verdana, Geneva, sans-serif';
                ctx.textBaseline = 'middle';
                ctx.fillStyle    = cfg.fontColor || 'white';
                contentLen       = ctx.measureText( content ).width;
                if( shape == 'arrow' ) {
                    btnLeft  = 13;
                    btnRight = 5;
                } else if(shape == 'round') {
                    adjust      = 1.5;
                    contentLen += 3;
                    btnLeft  = btnRight = 5;
                }
                canvas.height = 30;
                canvas.width  = btnLeft + contentLen + btnRight;
                ctx.drawImage( img, 0, 0, btnLeft, 30, 0, 0, btnLeft, 30 );
                ctx.drawImage( img, btnLeft, 0, 1, 30, btnLeft, 0, contentLen, 30 );
                ctx.drawImage( img, btnLeft + 1, 0, btnRight, 30, btnLeft + contentLen, 0, btnRight, 30 );
                ctx.font         = fontSize + 'px Verdana, Geneva, sans-serif';
                ctx.textBaseline = 'middle';
                ctx.fillStyle    = cfg.fontColor || 'white';
                ctx.fillText( content, btnLeft + adjust, canvas.height / 2 );
            };
        }
    } );

    return BaseTopBar;
} );