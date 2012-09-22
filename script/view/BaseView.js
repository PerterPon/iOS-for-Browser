
define( function( require, exports, module ){
    "use strick";

    require( 'Component' );
    Ext.define( 'BaseView', {
        extend : 'Component',

        inheritableStatics : {
            //本view的名称
            name    : null,

            //viewManager
            manager : require( './ViewManager' ),

            util : require( '../../util/Util' )
        },

        statics : {
            eventList : {

            }
        },

        constructor : function( cfg ){
            this.callParent([ cfg ]);
            this._attachEventListener();
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