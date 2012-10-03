
define( function( require, exports, module ){
    "use strick";

    require( '../Component' );

    var sockMngr = require( '../../util/SocketUtil' );
    Ext.define( 'BaseModel', {  
        extend : 'Component',

        inheritableStatics : {
            //webSocket连接的实例，理论上来说应该只有一个。
            socket  : null,
            //socket服务器连接地址
            scktAdd : 'ws://localhost:4239',
            manager : require( './ModelManager' )
        },

        statics : {
            name : null,

            needSocket : true
        },

        constructor : function( cfg ){
            this.callParent([ cfg ]);
            this.__creatWebSocket();
            this._initController();
            this._initView();
        },

        /**
         * [_creatWebSocket description]
         * @return  {[type]} [description]
         * @private
         */
        __creatWebSocket : function(){
            var sttc   = this.self,
                socket;
            if( sttc.needSocket ){
                sttc.socket = new WebSocket( sttc.scktAdd );
                sockMngr.setSocket( sttc.socket );
            }
        },

        /**
         * [_getData 获得数据]
         * @return {Object}   [获取到的数据]
         */
        _getData : function(){
            var sttc = this.self;
            sockMngr.emit( 'getData', sttc._name );
            sockMngr.on( 'getDataBak', function( data ){
                return data;
            });
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
         * [_requestData 向后台请求数据]
         * @return  {void} []
         * @protected
         */
        _requestData : function(){
            
        },

        /**
         * [_getData 获取数据]
         * @return  {Object} [取得的数据]
         * @private
         */
        _getData : function(){
            return this.self.data;
        },

        /**
         * [_pushInitInfo 向view推送初始化信息，并通知view进行初始化操作]
         * @return {void}
         */
        _pushInitInfo : function(){
            var sttc = this.self,
                view = sttc.view;
            view.init(  );
        }

    });

    return BaseModel;
});