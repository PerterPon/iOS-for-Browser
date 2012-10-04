
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

            elPool : {},

            /**
             * [eventList 需要添加的事件列表]
             * @type {Array}
             * @example: [
             *     [ eventName, eventBody, tarObj, scope ]
             * ]
             * eventBody的名称默认和eventName一致;
             */
            eventList : [],
        },

        statics : {
            initInfo : null
        },

        constructor : function( cfg ){
            this.callParent( [ cfg ] );
            this._initView();
            this._beforeRender();
            this._render();
            this._afterRender();
        },

        /**
         * 初始化本view，会在最初的时候调用
         * @return {void}
         */
        _initView : function(){
            var sttc = this.self;
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
         * @protected
         */
        _initInnerDom : function(){},

        /**
         * 渲染
         * @return {void}
         */
        _render : function(){
            this._initInnerDom();
            this._attachEventListener();
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
                that   = this,
                manager= sttc.manager,
                view, eventName, eventBody, scope;
            for( var i = 0; i < events.length; i++ ){
                view   = manager.getView( events[ 1 ] || that );
                eventName = events[ 0 ];
                util.listen( tarObj, eventName, eventName, that );
            }
        },

        /**
         * [getEl 获得当前View的jQuery对象]
         * @return {jQuery} [当前View的jQuery对象]
         */
        _getEl : function( select, isForce ){
            var sttc     = this.self,
                elCache  = sttc.elPool,
                selector = select || sttc.selector,
                $el;
            if( elCache[ selector ] && !isForce ){
                $el      = elCache[ selector ];
            } else {
                $el = selector == sttc.selector ? $( selector ) : $( sttc.selector ).find( selector );
                sttc.elPool[ selector ] = $el;
            }
            return $el;
        },

        /**
         * [_getElCacheByCls 根据class名称获取当前view下的节点]
         * @param   {string} class [根据class名称从当当前view下获取节点]
         * @return  {jQuery}       [匹配的jQuery对象]
         * @protected
         */
        _getElCacheByCls : function( className ){
            return this._getEl( className );
        },

        /**
         * [_getElByCls 根据Class获取当前view下的节点,此方法不会将节点缓存至缓存池，适用于只需要取一次或者两次的情况]
         * @param   {string} class [class名称]
         * @return  {jQuery}       [匹配的jQuery对象]
         * @protected
         */
        _getElByCls : function( className ){
            return $( this.self.selector ).find( '.' + className );
        }

    });

    return BaseView;
});