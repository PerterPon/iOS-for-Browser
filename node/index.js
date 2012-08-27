var fs   = require('fs'),
	http = require('http'),
	webSocket = require('ws'), 
	wss  = creatHttpServer();
	
wss.on('connection', function( ws ) {
	console.log('connected');
	ws.on('message', onmessage);
	ws.on('close', function() {
		console.log('stopping client');
	});
});

var nameTable = {
	"testStore" : "Data/test.json"
}

function creatHttpServer(){
	var app = http.createServer( '' ).listen( 4239 ),
		WebSocketServer = webSocket.Server,
		wss = new WebSocketServer( { server : app } );
	return wss;
}

function onmessage(buffer, flags){
	var buffer = JSON.parse(buffer),
		name   = buffer.storeName,
		data   = buffer.data,
		dataBuffer = JSON.stringify(data);
	fs.writeFile(nameTable[name], dataBuffer, function(err){
		if(err){
			throw err;
		}
		console.log("Store: " + name);
		console.log("data: " + dataBuffer);
	});
}

function doGetData(){
	
}
