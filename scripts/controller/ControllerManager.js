
//store管理器，每个store实例化的时候都会注册到storeManager上面

define(function(require, exports, module){
    "use strict";

    //store缓存池
    var storePool = {};

    function register( name, store ){
        if(!name || !store){
            return false;
        }
        storePool[ name ] = store;
    }

    return {
        register : register
    };

}); 