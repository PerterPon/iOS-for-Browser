
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VIcon', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'initComplete' ],
                [ 'iconIn' ],
                [ 'iconOut' ],
                [ 'startShake' ],
                [ 'stopShake' ],
                [ 'changePosition' ],
                [ 'showShadeLayer' ],
                [ 'hideShadeLayer' ],
                [ 'shadeLayerTransparent' ],
                [ 'shadeLayerBlack' ],
                [ 'dragStartTranslate' ],
                [ 'dragEndTranslate' ]
            ]
        },

        statics : {
            scaleLayer : 'iOS_icon_scaleLayer',
            shakeLayer : 'iOS_icon_shakeLayer',
            shadeLayer : 'iOS_icon_shadeLayer',
            iconImg    : 'iOS_icon_iconImg',
            iconName   : 'iOS_icon_iconName',

            /**
             * [shakeDeg icon抖动时候的角度]
             * @type {Number}
             */
            shakeDeg   : 2,
        },

        values : {
            shakeStartHandleFun : null,
            shakeEndHandleFun   : null,
            shader              : null,
            shaker              : null
        },

        EinitComplete : function( inPos, outPos ){
            var sttc = this.values,
                funs = this.__getShakeStartEndHandleFun();
            sttc.shakeStartHandle = funs[ 'shakeStart' ];
            sttc.shakeStopHandle  = funs[ 'shakeStop' ];
            this.__initIconView( inPos, outPos );
        },

        EiconIn : function( position ){
            this.__doSetIconPos( position );
        },

        EiconOut : function( position ){
            this.__doSetIconPos( position );
        },

        EstartShake : function(){
            this.values.shakeStartHandle();
        },

        EstopShake : function(){
            this.values.shakeStopHandle();
        },

        EchangePosition : function( position ){
            this.__doSetIconPos( position );
        },

        EshowShadeLayer : function(){
            this.values.shader.show().css( 'background', 'rgba( 0, 0, 0, 0.3 )' );
        },

        EhideShadeLayer : function(){
            this.values.shader.hide().css( 'background', 'rgba( 0, 0, 0, 0 )' );
        },

        EshadeLayerTransparent : function(){
            this.values.shader.css( 'background', 'rgba( 0, 0, 0, 0 )' );
        },

        EshadeLayerBlack : function(){
            this.values.shader.css( 'background', 'rgba( 0, 0, 0, 0.3 )' );
        },

        EdragStartTranslate : function( scaleMultiple ){
            var scaler = this._getElCacheByCls( this.self.scaleLayer )[ 0 ];
            scaler.style.webkitTransform = 'scale3d('+ scaleMultiple +', '+ scaleMultiple +', '+ scaleMultiple +')';
            //FIXME
            scaler.style.opacity = '0.5';
        },

        EdragEndTranslate : function(){
            var scaler = this._getElCacheByCls( this.self.scaleLayer )[ 0 ];
            scaler.style.webkitTransform = 'scale3d( 1, 1, 1 )';
            //FIXME
            scaler.style.opacity = '1';
        },

        _initInnerDom : function(){
            var sttcs = this.self,
                sttc  = this.values,
                htmlData = '<div class="'+ sttcs.scaleLayer +'">' +
                        '<div class="'+ sttcs.shakeLayer +'">' +
                            '<img class="'+ sttcs.iconImg +'" src="resource/images/icons/icon_'+ sttc.name.substr( 1 ) +'.png" />' +
                            '<div class='+ sttcs.shadeLayer +'>' +
                            '</div>' +
                            '<span class="'+ sttcs.iconName +'">'+ sttc.cfg.text +'</span>' +
                        '</div>' +
                    '</div>';
            this._getEl().html( htmlData );
        },

        _afterRender : function(){
            var sttc    = this.values,
                sttcs   = this.self;
            sttc.shaker = this._getElByCls( sttcs.shakeLayer );
            sttc.shader = this._getElByCls( sttcs.shadeLayer );
        },

        _attachDomEvent : function(){
            var sttc  = this.values,
                sttcs = this.self,
                ctrl  = sttc.controller,
                Util  = sttcs.Util,
                that  = this,
                icon  = this._getEl()[ 0 ];
            this._getEl().on( $.support.touchstart, function( event ){
                Util.notify( ctrl, 'touchStart', [ event ] );
            }).on( $.support.touchmove, function( event ){
                Util.notify( ctrl, 'touchMove', [ event ] );
            }).on( $.support.touchstop, function( event ){
                // event.stopPropagation
                Util.notify( ctrl, 'touchEnd', [ event ] );
            });
            this._getElCacheByCls( sttcs.shadeLayer ).on( $.support.touchstart, function( event ){
                event.stopPropagation();
                icon.style.webkitTransitionDuration = '0';
                icon.style.webkitTransitionDelay    = '0';
                icon.style.zIndex                   = '1';
                Util.notify( ctrl, 'dragStart', [ event ] );
            }).on( $.support.touchmove, function( event ){
                event.stopPropagation();
                Util.notify( ctrl, 'dragMove', [ event ] );
            }).on( $.support.touchstop, function(){
                event.stopPropagation();
                //FIXME
                icon.style.webkitTransitionDuration = '300ms';
                that._getElCacheByCls( sttcs.shadeLayer ).css( 'background', 'rgba( 0, 0, 0, 0 )' );
                Util.notify( ctrl, 'dragEnd', [ event ] );
                //FIXME
                icon.style.webkitTransitionDelay    = '100ms';
            });
            this._getElByCls( sttcs.scaleLayer )[ 0 ].addEventListener( 'webkitTransitionEnd', function( event ){
                event.stopPropagation();
            });
        },

        /**
         * [__initIconView 初始化图标，包括位置等]
         * @return {void}
         */
        __initIconView : function( inPos, outPos ){
            var sttc = this.values,
                cfg  = sttc.cfg;
            if( cfg.current || cfg.dock )
                this.__doSetIconPos( outPos );
            else
                this.__doSetIconPos( inPos );
        },

        /**
         * [__doSetIconPos 设置icon的位置]
         * @param  {Object} position [具体的位置信息]
         * @return {void}
         */
        __doSetIconPos : function( position ){
            var icon = this._getEl()[ 0 ];
            icon.style.webkitTransform = 'translate3d('+ position.x +'px, '+ position.y +'px, 0)';
        },

        /**
         * [__getShakeStartEndHandleFun 性能考虑，还是把震动这一部分的东西都搬到view层来做了]
         * @param  {String}  gesture [手势]
         * @return {Function}
         */
        __getShakeStartEndHandleFun : function(){
            var sttc    = this.values,
                sttcs   = this.self,
                shaker  = sttc.shaker[ 0 ],
                deg     = sttcs.shakeDeg,
                shaking = false,
                that    = this,
                icon    = this._getEl()[ 0 ],
                shakeStart, shakeStop, curDeg;
            return {
                'shakeStart' : shakeStartHandle,
                'shakeStop'  : shakeStopHandle 
            };
            function shakeHandle( event ){
                event.stopPropagation();
                curDeg *= -1;
                shaker.style.webkitTransform = 'rotateZ(' + curDeg + 'deg)';
            }
            function dragAutoTranslateComplete( event ){
                event.stopPropagation();
                sttcs.Util.notify( sttc.controller, 'dragAutoTranslateComplete' );
                //FIXME
                this.style.webkitTransitionDuration = '450ms';
                this.style.zIndex = 0;
            }
            function shakeStartHandle(){
                if( shaking )
                    return;
                sttc.shader.show().css( 'background', 'rgba( 0, 0, 0, 0 )' );
                var random = !Math.round(Math.random()) ? -1 : 1;
                icon.addEventListener( 'webkitTransitionEnd', dragAutoTranslateComplete );
                curDeg = deg * random;
                shaker.style.webkitTransform = 'rotateZ(' + curDeg + 'deg)';
                shaker.addEventListener( 'webkitTransitionEnd', shakeHandle );
                shaking = true;
            }
            function shakeStopHandle(){
                icon.removeEventListener( 'webkitTransitionEnd', dragAutoTranslateComplete );
                shaker.removeEventListener( 'webkitTransitionEnd', shakeHandle );
                shaker.style.webkitTransform = 'rotateZ(0)';
                shaking = false;
            }
        }

    });

    return VIcon;
});