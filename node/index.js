require( 'seajs' );
var fs       = require( 'fs' ),
    http     = require( 'http' ),
    webSocket= require( 'ws' ), 
    wss      = createHttpServer(),
    scktMngr = require( '../util/SocketUtil' ),
    filePath = require( './filePath' ),
    socket;

console.log( ' - started!' );

wss.on( 'connection', onconnection );

function onconnection( ws ){
    console.log( ' - connected!' );
    socket = ws;
    scktMngr.setSocket( ws );
    ws.on( 'close', function(){
        console.log( ' - disconnected!' );
    });
}

scktMngr.on( 'getData', function( data ){
    var name = data.data.storeName,
        result;
    if( !name )
        throw 'store name can not be empty!';
    else 
        result = doGetData( name );
    scktMngr.emit( 'getDataBak', result );
});

scktMngr.on( 'saveData', function( data ){
    var name = data.data.storeName;
    if( !name )
        throw 'store name can not be empty!';
    else
        doSaveData( name, JSON.stringify( data.data.storeData ));
    scktMngr.emit( 'saveDataBak', { "result" : "succeed" });
});

function createHttpServer(){
    var app = http.createServer( '' ).listen( 4239 ),
        WebSocketServer = webSocket.Server,
        wss = new WebSocketServer({ server : app });
    return wss;
}

function doGetData( name ){
    var result = require( './' + filePath[ name ] );
    console.log( ' - getData' );
    console.log( ' - storeName: ' + name );
    return result;
}

function doSaveData( name, dataBuffer ){
    console.log( ' - saveData' );
    console.log( ' - storeName: ' + name );
    fs.writeFileSync( filePath[name], dataBuffer );
}
