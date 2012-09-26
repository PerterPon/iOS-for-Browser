
define( function( require, exports, module ){
    "use strick";

    var sockMngr = require( './util/SocketUtil' ),
        strMngr  = require( './script/store/StoreManager' );
    Ext.define( 'BaseStore', {

        inheritableStatics : {
            //webSocket连接的实例，理论上来说应该只有一个。
            socket : null,
            //socket服务器连接地址
            scktAdd: 'ws://localhost:4239'
        },

        statics: {
            //store的ID，唯一
            name   : null,
            //数据池，所有更改的数据首先会在数据池里面进行操作
            dataPool : null
        },

        constructor: function( name ){
            this._registStore( name, this );
            this._creatWebSocket();
        },

        /**
         * [_creatWebSocket description]
         * @return  {[type]} [description]
         * @protected
         */
        _creatWebSocket: function(){
            var sttc   = this.self,
                socket;
            if( !sttc.socket ){
                sttc.socket = new WebSocket( sttc.scktAdd );
                sockMngr.setSocket( sttc.socket );
            }
        },

        /**
         * [__registStore description]
         * @param   {[type]} name  [description]
         * @param   {[type]} store [description]
         * @return  {[type]}       [description]
         * @protected
         */
        _registStore: function( name, store ){
            strMngr.register( name, store );
        },

        getData: function(){
            var sttc = this.self;
        }

    });

    return BaseStore;
});