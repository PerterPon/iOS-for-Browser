
/**
 * List组件均只会根据数据返回HTML，而不会进行任何和DOM相关的操作，list中只会处理list自己的逻辑。
 */
define( function( require, exports, model ) {
    //"use strict";

    require( '../../view/BaseView' );
    var RangeClick = require( '../../event/RangeClick' );
    Ext.define( 'List', {
        extend : 'BaseView',

        inheritableStatics : {
            listBoxCls  : 'iOS_list_box',
            listItemCls : 'iOS_list_item',
            listItemSelectedCls  : 'iOS_list_item_selected',
            listItemTitleCls     : 'iOS_list_item_title',
            listItemDeleteSpanCls: 'iOS_list_item_deleteSpan'
        },

        manager : require( './ListManager' ),

        values : {
            /**
             * [data 要渲染的数据]
             * @type {Object}
             */
            data : null,
            /**
             * [baseCls 列表容器的class]
             * @type {String}
             */
            baseCls : null,

            /**
             * [deleteable 标记列表项是否可以被删除]
             * @type {[Boolean]}
             */
            deleteable : null,

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
             * @type {[String]}
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
             * [clickedCallback 单击Item时候的回调函数]
             * @return {void}
             */
            clickedCallback : function() { return true; }
        },

        constructor : function( cfg, baseCls, deleteable ) {
            this.callParent( [ cfg ] );
            this.values.baseCls    = baseCls;
            this.values.deleteable = deleteable;
        },

        /**
         * [getDom 获取list的html,供前台使用]
         * @return {[type]} [description]
         */
        getDom : function() {
            return this.values.listBox;
        },

        /**
         * [setData 设置需要渲染的数据]
         * @param {[Object]} data [需要渲染成列表的数据]
         */
        setData : function( data ) {
            var html, dom;
            if( data ) {
                this.values.data = data;
                html = this._generateHtml();
                dom  = this._generateDom( html );
            }
        },

        /**
         * [getContentByIdx 根据index信息获取]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        getContentByIdx : function( index ) {
            var data = this.values.data.listContent;
            return {
                index   : index,
                title   : data[ index ][ 'title' ],
                content : data[ index ][ 'content' ]
            };
        },

        /**
         * [clearSelect 清除当前选取对象]
         * @return
         */
        clearSelect : function() {
            this.values.selectedItem.classList.remove( this.self.listItemSelectedCls );
            this.values.selectedItem = null;
        },

        /**
         * [_generateHtml 生成HTML字串]
         * @return {[String]} [HTML字串]
         */
        _generateHtml : function() {
            var sttcs = this.values,
                sttc  = this.self,
                data  = sttcs.data.data.listData,
                len   = data.length,
                html  = '';
            for( i    = 0; i < len; i++ ) {
                html  += 
                    '<div class="'+ sttc.listItemCls +'" index="'+ i +'">' +
                        '<div class="'+ sttc.listItemTitleCls +'">' +
                            data[ i ][ 'title' ] +
                        '</div>' +
                        '<div class="'+ sttc.listItemDeleteSpanCls +'">' +
                        '</div>' +
                    '</div>';
            }
            return html;
        },

        /**
         * [_generateDom 根绝html生成相应的DOM节点]
         * @return {}
         */
        _generateDom : function( html ) {
            this.values.listBox.children( '.' + this.self.listBoxCls ).append( html );
        },

        _attachDomEvent : function() {
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                rangeClick = sttc.rangeClick = new RangeClick( {
                    rangeClick : sttcs.Util.bind( this._itemClickHandle, this )
                } ),
                support   = $.support,
                eventList = [],
                $listBox  = sttc.listBox;
            eventList[ support.touchstart ] = Util.bind( rangeClick.touchStart, rangeClick );
            eventList[ support.touchmove ]  = Util.bind( rangeClick.touchMove,  rangeClick );
            eventList[ support.touchstop ]  = Util.bind( rangeClick.touchStop,  rangeClick );
            $listBox.on( eventList, '.'+ sttcs.listItemCls );
            window.iOS.Event.addEvent( 'reopenApp', Util.bind( this.__reopenAppHandle, this ) );
        },

        _beforeRender : function() {
            var sttc      = this.values,
                sttcs     = this.self,
                config    = {
                    direction  : 'vertical',
                    bounces    : 'vertical'
                };
            sttc.listBox = $(
                '<div class="dragScroll_parent">' + 
                    '<div class="'+ sttcs.listBoxCls +' '+ sttc.listBoxCls +'"></div>' +
                '</div>'
            );
            this.__enableScrollView();
        },

        _itemClickHandle : function( event ) {
            var sttc  = this.values,
                sttcs = this.self,
                selectedItem  = sttc.selectedItem,
                index;
            selectedItem && selectedItem.classList.remove( sttcs.listItemSelectedCls );
            selectedItem = event.currentTarget;
            selectedItem.classList.add( sttcs.listItemSelectedCls );
            sttc.selectedItem = selectedItem;
            index = selectedItem.getAttribute( 'index' );
            sttc.clickedCallback && sttc.clickedCallback( event, index );
        },

        __enableScrollView : function() {
            var sttc   = this.values,
                sttcs  = this.self,
                config = {
                    direction : 'vertical',
                    bounces   : 'vertical'
                };
            $.scrollView( sttc.listBox.children( '.' + sttcs.listBoxCls )[ 0 ], config );
        },

        __reopenAppHandle : function( appname ) {
            this.__enableScrollView();
        }

    });

    return List;
});