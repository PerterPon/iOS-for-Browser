
define( function( require, exports, module ){
    "use strick";

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

        register : function( name, object ){
            var sttc  = this.self;
            if( !name || !object )
                throw sttc.managerId + ' name or object can not be empty!';
            sttc.pool[ name ] = object;
        },

        get : function( name ){
            var sttc = this.self;
            if( !name )
                throw sttc.managerId + ' name can not be empty!';
            return sttc.pool[ name ];
        }

    });

});