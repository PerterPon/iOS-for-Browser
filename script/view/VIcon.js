
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VIcon', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'initComplete' ],
                [ 'iconIn' ],
                [ 'iconOut' ]
            ]
        },

        statics : {
            scaleLayer : 'iOS_icon_scaleLayer',
            shakeLayer : 'iOS_icon_shakeLayer',
            iconName   : 'iOS_icon_iconName'
        },

        EinitComplete : function( inPos, outPos ){
            var sttc    = this.self;
            sttc.inPos  = inPos;
            sttc.outPos = outPos;
            this.__initIconView();
        },

        EiconIn : function(){
            var sttc = this.self,
                icon = this._getEl()[ 0 ];
            icon.style.webkitTransform = 'translate3d('+ sttc.inPos.x +'px, '+ sttc.outPos.y +'px, 0)';
        },

        EiconOut : function(){
            var sttc = this.self,
                icon = this._getEl()[ 0 ];
            icon.style.webkitTransform = 'translate3d('+ sttc.outPos.x +'px, '+ sttc.outPos.y +'px, 0)';
        },

        _initInnerDom : function(){
            var sttc = this.self,
                htmlData = '<div class="'+ sttc.scaleLayer +'">' +
                        '<div class="'+ sttc.shakeLayer +'">' +
                            '<img src="resource/images/icons/icon_'+ sttc._name.substr( 1 ) +'.png" />' +
                            '<span class="'+ sttc.iconName +'">'+ sttc.cfg.text +'</span>' +
                        '</div>' +
                    '</div>';
            this._getEl().html( htmlData );
        },

        /**
         * [__initIconView 初始化图标，包括位置等]
         * @return {void}
         */
        __initIconView : function(){
            var sttc = this.self,
                cfg  = sttc.cfg;
            if( cfg.current || cfg.dock )
                this.__doSetIconPos( sttc.outPos );
            else 
                this.__doSetIconPos( sttc.inPos );
        },

        /**
         * [__doSetIconPos 设置图表的位置]
         * @param  {Object} position [具体的位置信息]
         * @return {void}
         */
        __doSetIconPos : function( position ){
            var icon = this._getEl()[ 0 ];
            icon.style.webkitTransform = 'translate3d('+ position.x +'px, '+ position.y +'px, 0)';
        }

    });

    return VIcon;
});