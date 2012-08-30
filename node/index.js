var fs   = require( 'fs' ),
	http = require( 'http' ),
	webSocket = require( 'ws' ), 
	wss  = createHttpServer(),
	socket;
	
wss.on('connection', function( ws ){
	console.log( 'connected' );
	socket = ws;
	ws.on( 'message', onmessage );
	ws.on( 'close', function(){
		console.log( 'stopping client' );
	});
});

var nameTable = {
	"testStore" : "Data/test.json"
}

function createHttpServer(){
	var app = http.createServer( '' ).listen( 4239 ),
		WebSocketServer = webSocket.Server,
		wss = new WebSocketServer({ server : app });
	return wss;
}

function onmessage( buffer, flags ){
	var buffer = JSON.parse( buffer ),
		name   = buffer.storeName;
	if( !name ){
		socket.send( 'store name is empty!' );
		throw 'store name is empty!';
	}
	var data   = buffer.data,
		oprtn  = buffer.operation,
		dataBuffer = JSON.stringify( data );
	if( oprtn == 'get' ){
		doGetData( name );
	} else if( oprtn == 'save' ){
		doSaveData( name, dataBuffer );
	}
}

function doGetData( name ){
	var result;
	fs.readFile( nameTable[name], 'utf-8', function( err, data ){
		if( err )
			throw err;
		result = JSON.stringify( data );
		console.log( '-GET' );
		console.log( '-store: ' + name );
		console.log( '-result: ' + result );
		socket.send( result );
	});

}

function doSaveData( name, dataBuffer ){
	fs.writeFile( nameTable[name], dataBuffer, function( err ){
		if(err)
			throw err;
		console.log( '-SAVE' );
		console.log( '-Store:' + name );
		console.log( '-data:'  + dataBuffer );
		socket.send( 'saveSucceed!' );
	});
}


