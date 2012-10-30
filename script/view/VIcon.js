
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
            var sttc    = this.values;
            sttc.inPos  = inPos;
            sttc.outPos = outPos;
            this.__initIconView();
        },

        EiconIn : function(){
            var sttc = this.values,
                icon = this._getEl()[ 0 ];
            icon.style.webkitTransform = 'translate3d('+ sttc.inPos.x +'px, '+ sttc.inPos.y +'px, 0)';
        },

        EiconOut : function(){
            var sttc = this.values,
                icon = this._getEl()[ 0 ];
            icon.style.webkitTransform = 'translate3d('+ sttc.outPos.x +'px, '+ sttc.outPos.y +'px, 0)';
        },

        _initInnerDom : function(){
            var sttcs = this.self,
                sttc  = this.values,
                htmlData = '<div class="'+ sttcs.scaleLayer +'">' +
                        '<div class="'+ sttcs.shakeLayer +'">' +
                            '<img src="resource/images/icons/icon_'+ sttc.name.substr( 1 ) +'.png" />' +
                            '<span class="'+ sttcs.iconName +'">'+ sttc.cfg.text +'</span>' +
                        '</div>' +
                    '</div>';
            this._getEl().html( htmlData );
        },

        _attachDomEvent : function(){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util; 
            this._getEl().on( 'rangeclick', function(){
                Util.notify( sttc.controller, 'iconClick' );
            });
        },

        /**
         * [__initIconView 初始化图标，包括位置等]
         * @return {void}
         */
        __initIconView : function(){
            var sttc = this.values,
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