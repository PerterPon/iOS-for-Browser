
var eventTree = {};

function listen( eventName, eventBody, scope ){
    eventTree[ eventName ] = eventBody;
}

function notify( eventName, data ){
    if( !eventTree[ eventName ])
        throw 'event is not exists!';
     
}