//供webSocket使用

define( function( require, exports, module ){
    "use strict";

    var eventTree = {},
        socket    = null;

    function on( eventName, eventBody ){
        eventTree[ eventName ] = eventBody;
    }

    function emit( eventName, data ){
        var bffrData = {
            eventName : eventName,
            data      : data
        };
        if( !socket.readyState ){
            socket.onopen = function(){
                socket.send( JSON.stringify( bffrData ));
            }
        } else {
            socket.send( JSON.stringify( bffrData ));    
        }
    }

    function setSocket( sockObj ){
        socket = sockObj;
        function mssgHandler( bffrData ){
            var sockData = JSON.parse( bffrData.data || bffrData ),
                eventName= sockData.eventName;
            if( !eventTree[ eventName ]){
                throw '-eventName: ' + eventName + ' has not register!';
                return;
            }
            eventTree[ eventName ]( sockData );
        }
        if( socket.on ){
            socket.on( 'message', mssgHandler );
        } else {
            socket.onmessage = mssgHandler;
        }
    }

    var result = {
        setSocket : setSocket,
        on        : on,
        emit      : emit
    };

    return result;
});