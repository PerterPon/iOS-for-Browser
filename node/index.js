var wss  = creatHttpServer(),
	fs   = require('fs'),
	http = require('http'),
	webSocket = require('ws'); 

wss.on('connection', function( ws ) {
	console.log('connected');
	ws.on('message', function( data, flags ) {
		ws.send('333');
	});
	ws.on('close', function() {
		console.log('stopping client');
	});
});

function creatHttpServer(){
	var app = http.createServer( '' ).listen( 4239 ),
		WebSocketServer = webSocket.Server,
		wss = new WebSocketServer( { server : app } );
	return wss;
}

function onmessage(err, data){
	if(err)
		throw err;

}

