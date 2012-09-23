
define( function( require, exports, module ){
    "use strick";

    require( '../Component' );
    Ext.define( 'BaseView', {
        extend : 'Component',

        inheritableStatics : {
            //本view的名称
            name    : null,

            //viewManager
            manager : require( './ViewManager' ),

            util : require( '../../util/Util' ),

            elPool : {}
        },

        statics : {
            eventList : {},
            
        },

        constructor : function( cfg ){
            this.callParent( [ cfg ] );
            this._initView();
            this._attachEventListener();
        },

        /**
         * 初始化本view，会在最初的时候调用
         * @return {void}
         */
        _initView : function(){
            var sttc = this,self;
            sttc.elPool = {};
            if( sttc.visiable === false ){
                this._getEl().hide();
            }
        },

        /**
         * 渲染前执行
         * @return {void}
         */
        _beforeRender : function(){},

        /**
         * [_initInnerDom 初始化DOM]
         * @return  {void}
         * @private
         */
        _initInnerDom : function(){

        },

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

        /**
         * [getEl 获得当前View的jQuery对象]
         * @return {jQuery} [当前View的jQuery对象]
         */
        _getEl : function(){
            var sttc = this.self;
            if( sttc.elPool[ sttc.selector ] ){
                return sttc.elPool[ sttc.selector ];
            } else {
                return $( sttc.selector );
            }
        }

    });

    return BaseView;
});