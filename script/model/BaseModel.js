
define( function( require, exports, module ){
    "use strick";

    require( '../Component' );

    var sockMngr = require( '../../util/SocketUtil' ),
        scktAdd  = 'ws://localhost:4239',
        socket, needSocket;
    
    (function(){
        if( !needSocket ){
            socket = new WebSocket( scktAdd );
            sockMngr.setSocket( socket );
            needSocket = true;
        }
    })();

    Ext.define( 'BaseModel', {
        extend : 'Component',

        inheritableStatics : {
            manager : require( './ModelManager' )
        },

        statics : {
            name : null,

            needSocket : true
        },

        constructor : function( cfg ){
            this.callParent([ cfg ]);
            this._initController();
            this._initView();
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
            var sttc = this.self;
            if( !sttc.data ){
                this._requestData();
            }
            return this.self.data;
        }

    });

    return BaseModel;
});