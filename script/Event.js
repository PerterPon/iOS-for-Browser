
/**
 * [ 系统级别的事件都会存储在这里 ]
 */
define( function( require ){
    "use strick";

    var Util = require( '../util/Util' );
    window.iOS.Event = {
        eventPool : {},

        /**
         * [addEvent 添加全局事件，会维护一个事件队列]
         * @param {String} eventName [事件名称]
         * @param {Function} eventBody [事件处理函数]
         * @param {Object} tarObj    [事件处理函数宿主对象]
         */
        addEvent : function( eventName, eventBody, tarObj ){
            var evtPool = this.eventPool;
            evtPool[ eventName ] ? '' : evtPool[ eventName ] = [];
            evtPool[ eventName ].push(
                Util.bind( eventBody, tarObj )
            );
        },

        /**
         * [dispatchEvent 派发事件] 
         * @param  {String} eventName [派发事件的名称]
         * @param  {Array}  params    [参数]
         * @return {void}
         */
        dispatchEvent : function( eventName, params ){
            try {
                var evtPool = this.eventPool,
                    evtIns  = evtPool[ eventName ];
                for( var i = 0; i < evtIns.length; i++ ){
                    evtIns[ i ].apply( null, params );
                }
            } catch( e ){
                console.log( eventName + ' - there is no such event added!' );
            }
        },

        /**
         * [clearEvent 清除某一事件事件队列上的所有事件，但会保留一个空队列]
         * @param  {[type]} eventName [description]
         * @return {[type]}           [description]
         */
        clearEvent : function( eventName ){
            this.eventPool[ eventName ] = null;
            delete this.eventPool[ eventName ];
        }
    };
});