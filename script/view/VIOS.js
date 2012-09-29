
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VIOS', {
        extend : 'BaseView',

        statics : {
            bgId : 'iOS_system_content'
        },

        constructor : function( cfg ){
            this.callParent([ cfg ]);
            this.__initBackground();
        },

        /**
         * [__initBackground 初始化系统背景图片]
         * @return  {void}
         * @private
         */
        __initBackground : function(){
            var bgDom = document.getElementById( this.self.bgId ) || document.body;
            bgDom.style.background = '#25262B url(resource/images/background/background.jpg) no-repeat center center';
        }
    });

    return VIOS;
});