
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
                [ 'stopShake' ]
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
            shakeEndHandleFun : null
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
            sttc.shaker = this._getElByCls( sttcs.shakeLayer );
        },

        _attachDomEvent : function(){
            var sttc  = this.values,
                sttcs = this.self,
                ctrl  = sttc.controller,
                Util  = sttcs.Util,
                that  = this;
            this._getEl().on( $.support.touchstart, function( event ){
                event.stopPropagation();
                Util.notify( ctrl, 'touchStart', [ event ] );
                that._getElCacheByCls( sttcs.shadeLayer ).css({
                    'background' : 'rgba( 0, 0, 0, 0.3 )'
                }).show();
            }).on( $.support.touchstop, function( event ){
                event.stopPropagation();
                Util.notify( ctrl, 'touchEnd', [ event ] );
            });
            this._getElCacheByCls( sttcs.shadeLayer ).on( $.support.touchstart, function( event ){
                
            }).on( $.support.touchmove, function( event ){

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
                shakeStart, shakeStop, curDeg;
            return {
                'shakeStart' : shakeStartHandle,
                'shakeStop'  : shakeStopHandle 
            };
            function shakeHandle(){
                curDeg *= -1;
                shaker.style.webkitTransform = 'rotateZ(' + curDeg + 'deg)';
            }
            function shakeStartHandle(){
                if( shaking )
                    return;
                var random = !Math.round(Math.random()) ? -1 : 1;
                curDeg = deg * random;
                shaker.style.webkitTransform = 'rotateZ(' + curDeg + 'deg)';
                shaker.addEventListener( 'webkitTransitionEnd', shakeHandle );
                shaking = true;
            }

            function shakeStopHandle(){
                shaker.removeEventListener( 'webkitTransitionEnd', shakeHandle );
                shaker.style.webkitTransform = 'rotateZ(0)';
                shaking = false;
            }
        }

    });

    return VIcon;
});