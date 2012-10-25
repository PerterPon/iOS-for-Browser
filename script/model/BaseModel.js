
define( function( require, exports, module ){
    "use strick";

    require( '../Component' );

    var sockMngr = require( '../../util/SocketUtil' ),
        scktAdd  = 'ws://localhost:4239',
        socket, needSocket;
    
    (function(){
        socket = new WebSocket( scktAdd );
        sockMngr.setSocket( socket );
        needSocket = true;
    })();

    Ext.define( 'BaseModel', {
        extend : 'Component',

        inheritableStatics : {
            manager : require( './ModelManager' )
        },

        statics : {
            _name : null,
            _data : null 
        },

        constructor : function( cfg ){
            this.callParent([ cfg ]);
            if( cfg.needData )
                this._requestData();
            this._initProgram( cfg );
            this._initComplete();
        },

        _initComplete : function(){
            var sttc = this.self;
            if( !sttc.needData && sttc.renderChild )
                this._iteratorChild();
        },

        _attachEventListener : function(){
            this.callParent();
            var sttc = this.self,
                Util = sttc.Util;
            Util.listen( this, 'dataReady', this._dataReady );
        },

        /**
         * [_requestData 获得数据]
         * @return {Object}   [获取到的数据]
         */
        _requestData : function(){
            var sttc = this.self,
                that = this;
            sockMngr.checkSocket( norFn, errFn );
            function norFn(){
                sockMngr.on( 'getDataBak', function( data ){
                    sttc._data = data.data;
                    sttc.Util.notify( that, 'dataReady' );
                });
                sockMngr.emit( 'getData', { "storeName" : sttc._name }); 
            }
            function errFn(){
                sttc._data = that._getDefaultData();
                sttc.Util.notify( that, 'dataReady' )
            }
        },

        /**
         * [_getDefaultData 当socket连接不成功的时候，会从resource/dafaultData里面获取数据]
         * @return {Object} [data]
         */
        _getDefaultData : function(){
            return {};
        },

        /**
         * [_handleChildCfg 处理subview的配置信息，会直接修改self里面的内容]
         * @return {void}
         */
        _handleChildCfg : function(){},

        /**
         * [_iteratorChild 迭代初始化下属]
         * @return {[type]} [description]
         */
        _iteratorChild : function(){
            this._handleChildCfg();
            var iterator = require( '../Iterator' ),
                sttc     = this.self;
            iterator.setPreDom( sttc.selector );
            iterator.itrtrView( sttc._data.data );
        },

        _initProgram : function( cfg ){
            var sttc = this.self,
                View, Ctrl, viewCfg, ctrlCfg;
            if( sttc.controller ){
                Ctrl = sttc.controller;
                ctrlCfg = {
                    _name : 'C' + sttc._name
                };
                sttc.controller = new Ctrl( ctrlCfg );
            }
            if( sttc.view ){
                View = sttc.view;
                viewCfg = {
                    clsList : sttc.clsList,
                    _name   : 'V' + sttc._name,
                    visiable: sttc.visiable,
                    selector: sttc.selector,
                    controller : sttc.controller,
                    cfg     : cfg
                };
                sttc.view = new View( viewCfg );
            }
            if( sttc.controller )
                sttc.controller.setMV( this, sttc.view );
        },

        /**
         * [_initView 初始化view]
         * @return  {void}
         * @protected
         */
        _initView : function(){
            var sttc    = this.self;
            if( !sttc.view )
                return;
            var view    = sttc.view,
                viewCfg = {
                    clsList : sttc.clsList,
                    _name   : 'V' + sttc._name,
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
        _initController : function(){
            var sttc = this.self;
            if( !sttc.controller )
                return;
            var ctrl = sttc.controller;
            sttc.controller = new ctrl( sttc.ctrlCfg );
        },

        /**
         * [_dataReady 当数据加载完成时调用]
         * @return {}
         */
        _dataReady : function(){
            if( this.self.renderChild )
                this._iteratorChild();
        },

        /**
         * [_getData 获取数据]
         * @return  {Object} [取得的数据]
         * @public
         */
        getData : function(){
            return sttc._data;
        }

    });

    return BaseModel;
});