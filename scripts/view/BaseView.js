
define( function( require, exports, module ){
    "use strict";

    Ext.define( 'BaseView', {

        inheritableStatics : {
            //本view的名称
            name : null,

            //viewManager
            viewMngr : require( 'scripts/view/ViewManager' ),

            util : require( 'util/Util' )
        },

        statics : {
            eventList : {

            }
        },

        /**
         * 构造函数
         * @param  {String} name       本view的名称
         * @param  {Object} controller 本view对应的controller对象
         * @return {void}
         */
        constructor : function( name, controller ){
            this._registerSelf();
            this._attachEventListener();
        },

        /**
         * 将view本身注册到viewManager中去
         * @return {void}
         */
        _registerSelf : function(){
            var sttc = this.self;
            sttc.viewMngr.register( sttc.name, this );
        },

        /**
         * 初始化本view，会在最初的时候调用
         * @return {void}
         */
        _initView : function(){},

        /**
         * 渲染前执行
         * @return {void}
         */
        _beforeRender : function(){},

        /**
         * 渲染
         * @return {void}
         */
        _render : function(){
            this.initDom();
        },

        /**
         * 渲染后执行
         * @return {void}
         */
        _afterRender : function(){},

        /**
         * 添加Dom节点上的事件
         * @return {void}
         */
        _attachDomEvent : function(){},

        /**
         * 添加view上的事件
         * @return {void}
         */
        _attachEventListener : function(){
            var sttc   = this.self,
                events = sttc.eventList,
                util   = sttc.util,
                view;
            for( var i in events ){
                view = viewMngr.getView( events[ i ].view );
                util.listen(  );
            }
        },

    });

    return BaseView;
});