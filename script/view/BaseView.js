
define( function( require, exports, module ){
    "use strick";

    require( '../Component' );
    Ext.define( 'BaseView', {
        extend : 'Component',

        inheritableStatics : {
            manager : require( './ViewManager' ),
        },

        values : {
            name    : null,
            initInfo : null,
            /**
             * [elPool 节点缓冲池，如果使用缓存方法，则会将节点缓存到此处。]
             * @type {Object}
             */
            elPool : {}
        },

        constructor : function( cfg ){
            this.callParent( [ cfg ] );
            this._initView();
            this._beforeRender();
            this._render();
            this._afterRender();
        },

        /**
         * [setController 设置controller]
         * @param {Object} ctrl [controller]
         */
        setController : function( ctrl ){
            this.self.ctrl = ctrl;
        },

        /**
         * 初始化本view，会在最初的时候调用
         * @return {void}
         */
        _initView : function(){
            var sttc    = this.values;
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
            this._attachDomEvent();
        },

        /**
         * 渲染后执行
         * @return {void}
         */
        _afterRender : function(){},

        /**
         * [_attachDomEvent 添加节点上的事件]
         * @return {void}
         */
        _attachDomEvent : function(){},

        /**
         * [getEl 获得当前View的jQuery对象]
         * @return {jQuery} [当前View的jQuery对象]
         */
        _getEl : function( select, isForce ){
            var sttc     = this.values,
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
            return $( this.values.selector ).find( '.' + className );
        },
        
        _removeElCacheByCls : function( className ){
            var sttc = this.values;
            sttc.elPool[ className ] = null;
            delete sttc.elPool[ className ];
        }

    });

    return BaseView;
});