
define( function( require, exports, module ) {
    //"use strict";

    Ext.define( 'BaseManager', {

        // inheritableStatics : {
        //     //缓存池，用换缓存各种子类数据
        //     pool      : {},
        //     //标识本manager的身份信息
        //     managerId : null
        // },

        values : {
            managerId : null,

            pool : {}
        },

        constructor: function( managerId ) {
            var sttc       = this.values;
            this.__initManager();
            sttc.managerId = managerId;
            this._registSelf( managerId );
        },

        /**
         * [register 注册相应的实例]
         * @param  {string} name   [实例名称]
         * @param  {Object} object [对应实例对象]
         * @return {void}
         */
        register : function( name, object ) {
            var sttc  = this.values;
            if( !name || !object )
                throw sttc.managerId + ' name or object can not be empty!';
            sttc.pool[ name ] = object;
        },

        /**
         * [get 获取相应实例]
         * @param  {string/object} name [实例名字，或者实例]
         * @return {Object}
         */
        get : function( name ) {
            var sttc = this.values;
            if( !name )
                throw sttc.managerId + ' name can not be empty!';
            if( typeof name === 'string' )
                return sttc.pool[ name ];
            else 
                return name;
        },

        /**
         * [_registSelf 将此manager注册到manager容器中]
         * @param  {[String]} id [manager的id]
         * @return {[void]}
         */
        _registSelf : function( id ) {
            window.iOS.Manager || ( window.iOS.Manager = {} );
            window.iOS.Manager[ id ] = this;
        },

        /**
         * [__initManager 初始化本manager]
         * @return {[type]} [description]
         */
        __initManager : function() {
            this.values = {};
            this.values.pool = {};
        }

    });

});