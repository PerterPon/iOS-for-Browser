//供webSocket使用

define( function( require, exports, module )){

    var brswEvntTree = {},
        nodeEvntTree = {},
        brswSocket = null,
        nodeSocket = null;

    function on( eventName, eventBody ){
        window ? brswEvntTree[ eventName ] = eventBody : 
                 nodeEvntTree[ eventName ] = eventBody;
    }

    function emit( eventName, data ){
        var socket;
        window ? socket = brswSocket :
                 socket = nodeSocket;
        var bffrData = {
            eventName : eventName,
            data      : data
        };
        socket.send( JSON.stringify( bffrData ));
    }

    function setSocket( socket ){
        var eventTree = null;
        if( window ){
            brswSocket = socket;
            eventTree  = brswEvntTree;
        } else{
            nodeSocket = socket;
            eventTree  = nodeEvntTree;
        }
        socket.onmessage = function( buffer, flags ){
            var bffrData = JSON.parse( buffer ),
                eventName= bffrData.eventName;
            if( !eventTree[ eventName ]){
                throw '-eventName: ' + eventName + ' has not register!';
                return;
            }
            eventTree[ eventName ]( bffrData );
        }
    }

    return {
        setSocket : setSocket,
        on        : on,
        emit      : emit
    };
};