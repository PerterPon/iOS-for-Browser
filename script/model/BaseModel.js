
define( function( require, exports, module ) {
    //"use strict";

    require( '../Component' );

    var sockMngr = require( '../../util/SocketUtil' ),
        scktAdd  = 'ws://localhost:4239',
        socket, needSocket;
    
    ( function() {
        socket = new WebSocket( scktAdd );
        sockMngr.setSocket( socket );
        needSocket = true;
    } )();

    Ext.define( 'BaseModel', {
        extend : 'Component',

        inheritableStatics : {
            manager : require( './ModelManager' )
        },

        values : {
            name : null,
            data : null
        },

        constructor : function( cfg ) {
            this.callParent([ cfg ]);
            this._initProgram( cfg );
            cfg.needData && this._requestData();
            this._initComplete();
        },

        _initComplete : function() {
            var sttc = this.values;
            !sttc.needData && sttc.renderChild && this._iteratorChild();
        },

        _attachEventListener : function() {
            this.callParent();
            var sttcs = this.self,
                Util  = sttcs.Util;
            Util.listen( this, 'dataReady', this._dataReady );
        },

        /**
         * [_requestData 获得数据]
         * @return {Object}   [获取到的数据]
         */
        _requestData : function() {
            var sttc  = this.values,
                sttcs = this.self,
                that  = this;
            sockMngr.checkSocket( norFn, errFn );
            function norFn(){
                sockMngr.on( sttc.name + 'GetDataBak', function( data ){
                    sttc.data = data.data;
                    sttcs.Util.notify( that, 'dataReady' );
                });
                sockMngr.emit( 'getData', { "storeName" : sttc.name }); 
            }
            function errFn(){
                sttc.data = that._getDefaultData();
                sttcs.Util.notify( that, 'dataReady' )
            }
        },

        /**
         * [_getDefaultData 当socket连接不成功的时候，会从resource/dafaultData里面获取数据]
         * @return {Object} [data]
         */
        _getDefaultData : function() {
            return {};
        },

        /**
         * [_handleChildCfg 处理subview的配置信息，会直接修改self里面的内容]
         * @return {void}
         */
        _handleChildCfg : function() {},

        /**
         * [_iteratorChild 迭代初始化下属]
         * @return {[type]} [description]
         */
        _iteratorChild : function() {
            this._handleChildCfg();
            var iterator = require( '../Iterator' ),
                sttc     = this.values;
            iterator.setPreDom( sttc.selector );
            iterator.itrtrView( sttc.data.data );
        },

        _initProgram : function( cfg ) {
            var sttc = this.values,
                View, Ctrl, viewCfg, ctrlCfg;
            if( sttc.controller ) {
                Ctrl = sttc.controller;
                ctrlCfg = {
                    name : 'C' + sttc.name
                };
                sttc.controller = new Ctrl( ctrlCfg );
            }
            if( sttc.view ) {
                View    = sttc.view;
                viewCfg = {
                    clsList : sttc.clsList,
                    name    : 'V' + sttc.name,
                    visiable: sttc.visiable,
                    selector: sttc.selector,
                    controller : sttc.controller,
                    cfg     : cfg
                };
                sttc.view = new View( viewCfg );
            }
            sttc.controller && sttc.controller.setMV( this, sttc.view );    
        },

        /**
         * [_initView 初始化view]
         * @return  {void}
         * @protected
         */
        _initView : function() {
            var sttc    = this.values;
            if( !sttc.view ) {
                return;
            }
            var view    = sttc.view,
                viewCfg = {
                    clsList : sttc.clsList,
                    name   : 'V' + sttc.name,
                    visiable: sttc.visiable,
                    selector: sttc.selector
                };
            sttc.view = new view( viewCfg );
        },

        /**
         * [_initController 初始化controller]
         * @return  {void}
         * @protected
         */
        _initController : function() {
            var sttc = this.values;
            if( !sttc.controller ) {
                return;
            }
            var ctrl = sttc.controller;
            sttc.controller = new ctrl( sttc.ctrlCfg );
        },

        /**
         * [_dataReady 当数据加载完成时调用]
         * @return {}
         */
        _dataReady : function() {
            this.values.renderChild && this._iteratorChild();
        },

        _getTouchPos : function( event, isTouchEnd ) {
            return $.support.touch ? isTouchEnd ? event.originalEvent.changedTouches[ 0 ] : event.originalEvent.touches[ 0 ] : event;
        },

        /**
         * [_getData 获取数据]
         * @return  {Object} [取得的数据]
         * @public
         */
        getData : function() {
            return this.values.data;
        }

    });

    return BaseModel;
} );