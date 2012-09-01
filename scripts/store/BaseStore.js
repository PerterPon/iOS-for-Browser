
define( function( require, exports, module ){
	"use strict";

	var sockMngr = require( '../../Util/SocketUtil' );
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

		_creatWebSocket: function(){
			var sttc   = this.self,
				socket;
			if( !sttc.socket ){
				sttc.socket = new WebSocket( sttc.scktAdd );
				sockMngr.setSocket( sttc.socket );
				sttc.socket.onopen  = function(){
					sockMngr.emit( 'myEvent1', { data : "hello nodejs!" });	
				};
			}

		},

		_registStore: function( name, store ){

		},

		getData: function(){
			var sttc = this.self;
			
		}

	});

	return BaseStore;
});