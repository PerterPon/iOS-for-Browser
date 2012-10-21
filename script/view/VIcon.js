
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VIcon', {
        extend : 'BaseView',

        statics : {
            scaleLayer : 'iOS_icon_scaleLayer',
            shakeLayer : 'iOS_icon_shakeLayer',
            iconName   : 'iOS_icon_iconName'
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
        }

    });

    return VIcon;
});