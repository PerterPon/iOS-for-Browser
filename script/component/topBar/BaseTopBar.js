
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

        values : {
            left  : {
                cfg  : {},
                el   : null
            },
            right : {
                cfg  : {},
                el   : null
            }
        },

        sigCard : null,

        setSigCard : function( sigCard ) {
            sigCard.addItems( 'topBar', this );
            this.sigCard = sigCard;
        },

        _initBtns : function() {
            var sttcs = this.values,
                that  = this,
                btns  = sttcs.btns;
            btns.forEach( function( value, index ) {
                sttcs[ value[ 'direction' ] ]          = {};
                sttcs[ value[ 'direction' ] ][ 'cfg' ] = value;
                that._doGenerateBtn( value[ 'type' ], value );
            } );
        },

        _attachDomEvent : function() {
            var sttc     = this.self,
                sttcs    = this.values,
                that     = this,
                leftBtn  = this._getElCacheByCls( sttc[ 'leftCls' ] ),
                rightBtn = this._getElCacheByCls( sttc[ 'rightCls' ] ),
                support  = $.support,
                leftEvtList  = {},
                rightEvtList = {};
            leftEvtList[ support.touchstart ]  = function() {
                that._creatBtn( sttcs[ 'left' ][ 'el' ], sttcs[ 'left' ][ 'cfg' ], true );
            };
            leftEvtList[ support.touchstop ]   = function( event ) {
                that._creatBtn( sttcs[ 'left' ][ 'el' ], sttcs[ 'left' ][ 'cfg' ] );
                that._leftBtnClickHandler( event );
            };
            rightEvtList[ support.touchstart ] = function() {
                that._creatBtn( sttcs[ 'right' ][ 'el' ], sttcs[ 'right' ][ 'cfg' ], true );
            }
            rightEvtList[ support.touchstop ]  = function( event ) {
                that._creatBtn( sttcs[ 'right' ][ 'el' ], sttcs[ 'right' ][ 'cfg' ] );
                that._rightBtnClickHandler();
            }
            leftBtn  && this._getEl().on( leftEvtList, '.'+ sttc[ 'leftCls' ] );
            rightBtn && this._getEl().on( rightEvtList, '.'+ sttc[ 'rightCls' ] );
        },

        _doGenerateBtn : function( type, cfg ) {
            var sttcs = this.values,
                btn;
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
            canvas.setAttribute( 'direction', dir );
            canvas.classList.add( this[ dir +'Cls' ] );
            canvas.classList.add( sttcs[ dir +'Cls' ] );
            this._creatBtn( canvas, cfg );
            sttc[ cfg[ 'direction' ] ][ 'el' ] = canvas;
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
            canvas.setAttribute( 'direction', dir );
            canvas.classList.add( sttcs[ dir +'Cls' ] );
            canvas.classList.add( this[ dir +'Cls' ] );
            this._creatBtn( canvas, cfg );
            sttc[ cfg[ 'direction' ] ][ 'el' ] = canvas;
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

        _creatBtn: function( canvas, cfg, pressed ){
            var sttc     = this.self,
                ctx      = canvas.getContext('2d'),
                shape    = cfg.type,
                content  = cfg.text,
                fontSize = cfg.fontSize || 12,
                btnLeft, btnRight, img, contentLen = 0, adjust = 0;
            //稍微留白调整
            contentLen += 3;
            img        = new Image();
            img.onload = function() {
                ctx.clearRect( 0, 0, canvas.width, canvas.height );
                ctx.font         = fontSize + 'px Verdana, Geneva, sans-serif';
                ctx.textBaseline = 'middle';
                ctx.fillStyle    = cfg.fontColor || 'white';
                contentLen       = ctx.measureText( content ).width;
                if( shape == 'arrow' ) {
                    btnLeft      = 13;
                    contentLen  += 2;
                    btnRight     = 5;
                } else if(shape == 'round') {
                    adjust       = 1.5;
                    contentLen += 3;
                    btnLeft      = btnRight = 5;
                }
                canvas.height    = 30;
                canvas.width     = btnLeft + contentLen + btnRight;
                ctx.drawImage( img, 0, 0, btnLeft, 30, 0, 0, btnLeft, 30 );
                ctx.drawImage( img, btnLeft, 0, 1, 30, btnLeft, 0, contentLen, 30 );
                ctx.drawImage( img, btnLeft + 1, 0, btnRight, 30, btnLeft + contentLen, 0, btnRight, 30 );
                ctx.font         = fontSize + 'px Verdana, Geneva, sans-serif';
                ctx.textBaseline = 'middle';
                ctx.fillStyle    = cfg.fontColor || 'white';
                ctx.fillText( content, btnLeft + adjust, canvas.height / 2 );
            };
            img.src    = './resource/images/component/bars/' + shape + ( pressed ? '_pressed' : '' ) +'.png';
        },

        /**
         * [_leftBtnClickHandler 左侧按钮单击事件]
         * @return {}
         */
        _leftBtnClickHandler : function( event ) {
            var sttc = this.self,
                cfg  = {
                    //FIXME:
                    direction : 'right',
                    callBack  : sttcs.Util.bind( this._showAndHide, this )
                };
            this.sigCard.changeCard( 'leftBtn', cfg );
        },

        _showAndHide : function( showOrHide ) {
            if( 'hide' === showOrHide ) {
                this.getEl().css( 'opacity', 0 );
            }
        },

        /**
         * [_rightBtnClickHandler 右侧按钮单击事件]
         * @return {}
         */
        _rightBtnClickHandler : function( event ) {
            var cfg = {};
            this.sigCard.changeCard( 'rightBtn', cfg );
        },

    } );

    return BaseTopBar;
} );