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
        socket.send( JSON.stringify( bffrData ));
    }

    function setSocket( sockObj ){
        socket = sockObj;
        function mssgHandler( buffer ){
            var bffrData = JSON.parse( buffer ),
                eventName= bffrData.eventName;
            if( !eventTree[ eventName ]){
                throw '-eventName: ' + eventName + ' has not register!';
                return;
            }
            eventTree[ eventName ]( bffrData );
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