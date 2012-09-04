
define( function( require, exports, module ){
    "use strict";

    Ext.define( 'BaseView', {

        inheritableStatics : {
            //本view的名称
            name : null,

            //viewManager
            viewMngr: require( 'scripts/view/ViewManager' )
        },

        statics : {

        },

        /**
         * 构造函数
         * @param  {String} name       本view的名称
         * @param  {Object} controller 本view对应的controller对象
         * @return {void}
         */
        constructor : function( name, controller ){
            this._registerSelf();
        },

        /**
         * 将view本身注册到viewManager中去
         * @return {void}
         */
        _registerSelf : function(){
            var sttc = this.self;
            sttc.viewMngr.register( sttc.name, this );
        },

        _render : function(){
            
        }

    });

    return BaseView;
});