//供webSocket使用

define( function( require, exports, module ){
    "use strick";

    var eventTree = {},
        socket    = null;

    /**
     * [on 在socket连接上绑定事件]
     * @param  {String} eventName [事件名称]
     * @param  {Object} eventBody [事件处理函数]
     * @return {void}
     */
    function on( eventName, eventBody ){
        eventTree[ eventName ] = eventBody;
    }

    /**
     * [emit 触发socket连接的事件]
     * @param  {String} eventName [事件名称]
     * @param  {*} data           [传输的数据]
     * @return {void}
     */
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

    /**
     * [setSocket 设置socket对象，理论上一次连接只会对应一个]
     * @param {Object} sockObj [webSocket实例对象]
     */
    function setSocket( sockObj ){
        socket = sockObj;
        function mssgHandler( bffrData ){
            var sockData = JSON.parse( bffrData.data || bffrData ),
                eventName= sockData.eventName;
            if( !eventTree[ eventName ])
                throw '-eventName: ' + eventName + ' has not register!';
            eventTree[ eventName ]( sockData );
        }
        if( socket.on )
            socket.on( 'message', mssgHandler );
        else 
            socket.onmessage = mssgHandler;
    }

    /**
     * [checkSocket 检查socket连接是否正常]
     * @return {Bool} [正常则返回true，否则返回false]
     */
    function checkSocket(){
        if( !socket.readyState )
            return false;
        else 
            return true;
    }

    var result = {
        setSocket  : setSocket,
        on         : on,
        emit       : emit,
        checkSocket: checkSocket
    };

    return result;
});