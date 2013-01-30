
define( function( require, exports, module ){
    //"use strict";

    Ext.define( 'BaseManager', {

        inheritableStatics : {
            //缓存池，用换缓存各种子类数据
            pool      : {},
            //标识本manager的身份信息
            managerId : null
        },

        constructor: function( managerId ){
            var sttc       = this.self;
            sttc.managerId = managerId; 
        },

        /**
         * [register 注册相应的实例]
         * @param  {string} name   [实例名称]
         * @param  {Object} object [对应实例对象]
         * @return {void}
         */
        register : function( name, object ){
            var sttc  = this.self;
            if( !name || !object )
                throw sttc.managerId + ' name or object can not be empty!';
            sttc.pool[ name ] = object;
        },

        /**
         * [get 获取相应实例]
         * @param  {string/object} name [实例名字，或者实例]
         * @return {Object}
         */
        get : function( name ){
            var sttc = this.self;
            if( !name )
                throw sttc.managerId + ' name can not be empty!';
            if( typeof name === 'string' )
                return sttc.pool[ name ];
            else 
                return name;
        }

    });

});