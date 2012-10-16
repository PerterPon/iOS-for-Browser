
define( function( require, exports, module ){
    "use strick";

    require( '../Component' );
    Ext.define( 'Icon', {
        extend : 'Component',

        statics : {
            scaleLayer : 'iOS_icon_scaleLayer',
            shakeLayer : 'iOS_icon_shakeLayer',
            iconName   : 'iOS_icon_iconName'
        },

        _initInnerDom : function(){
            var sttc = this.self,
                htmlData = '<div class="'+ sttc.iconCls +'">' +
                    '<div class="'+ sttc.scaleLayer +'">' +
                        '<div class="'+ sttc.shakeLayer +'">' +
                            '<img src="resource/images/icons/icon_'+ sttc._name +'.png" />' +
                            '<span class="'+ sttc.iconName +'">'+ sttc.text +'</span>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            this._getEl().html( htmlData );
        }
    });
});