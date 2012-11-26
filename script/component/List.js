
/**
 * List组件均只会根据数据返回HTML，而不会进行任何和DOM相关的操作，list中只会处理list自己的逻辑。
 */
define( function( require, exports, model ){
    "use strick";

    require( '../Component' );
    var RangeClick = require( '../event/RangeClick' );
    Ext.define( 'List', {
        extend : 'Component',

        inheritableStatics : {
            listBoxCls : 'iOS_list_box',
            listItemCls : 'iOS_list_item',
            listItemSelectedCls : 'iOS_list_item_selected'
        },

        values : {
            /**
             * [listBox list容器]
             * @type {String}
             */
            listBox : null,
            /**
             * [listContentCls 对于list容器的自定义class]
             * @type {String}
             */
            listBoxCls : null,
            /**
             * [listItemCls list列表项的自定义class]
             * @type {[type]}
             */
            listItemCls : null,
            /**
             * [rangeClick rangeClick的实例对象]
             * @type {Object}
             */
            rangeClick : null,
            /**
             * [selectedItem 被单击的item项]
             * @type {jQuery Object}
             */
            selectedItem : null,
            /**
             * [dragInstance 拖动效果的实例对象]
             * @type {Object}
             */
            dragInstance : null,
            /**
             * [clickedCallaback 单击Item时候的回调函数]
             * @return {void}
             */
            clickedCallback : function(){ return true; }
        },

        /**
         * [_registerSelf 重载]
         * @return {void}
         */
        _registerSelf : function(){},

        _attachEventListener : function(){
            var sttc  = this.values,
                sttcs = this.self,
                rangeClick = sttc.rangeClick = new RangeClick({
                    rangeClick : _itemClickHandle
                }),
                dragCfg = {
                    direction  : 'vertical',
                    bounces    : 'vertical'
                };
            $( '.' + sttcs.listItemCls ).live( $.support.touchstart, rangeClick.touchStart)
            .live( $.support.touchmove, rangeClick.touchMove )
            .live( $.support.touchend, rangeClick.touchEnd );
            sttc.dragInstance = $.scrollView( sttc.listBox, dragCfg );
        },

        _init : function(){
            var sttc    = this.values,
                sttcs   = this.self;
            sttcs.listBox = $( '<div class="'+ sttcs.listBoxCls +' '+ sttc.listBoxCls +'"></div>' );
        },

        /**
         * [_itemClickHandle 列表项单击事件处理函数]
         * @param  {MouseEvenet} event [事件对象]
         * @return {void}
         */
        _itemClickHandle : function( event ){
            var sttc  = this.values,
                sttcs = this.self,
                selectedItem  = sttc.selectedItem;
            selectedItem && selectedItem.removeClass( sttcs.listItemSelectedCls );
            sttc.selectedItem = $( event.currentTarget );
        },

        /**
         * [rollBack2InitStatus 回滚到最初始的状态]
         * @return {Boolean}
         */
        rollBack2InitStatus : function(){
            var sttc  = this.values,
                sttcs = this.self,
                selectedItem = sttc.selectedItem;
            selectedItem && selectedItem.removeClass( sttcs.listItemSelectedCls );
        }

    });

    return List;
});