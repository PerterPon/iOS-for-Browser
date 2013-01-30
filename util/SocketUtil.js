//供webSocket使用

define( function( require, exports, module ){
    //"use strict";

    var eventTree    = {},
        requestQueue = [],
        socket       = null;

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
     * [checkSocket 检查socket链接，执行相应的动作]
     * @param  {Function} norFn [socket连接正常时候的处理函数]
     * @param  {Function} errFn [socket连接不正常时候的处理函数，通常会去加载默认的数据]
     */
    function checkSocket( norFn, errFn ){
        norFn = norFn || function(){};
        errFn = errFn || function(){};
        if( socket.readyState == 2 || socket.readyState == 3 )
            errFn();
        else if( socket.readyState == 1 )
            norFn();
        else {
            socket.addEventListener( 'open',  norFn );
            socket.addEventListener( 'close', errFn );
        }
    }

    var result = {
        setSocket  : setSocket,
        on         : on,
        emit       : emit,
        checkSocket: checkSocket
    };

    return result;
});