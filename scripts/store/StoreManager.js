
//store管理器，每个store实例化的时候都会注册到storeManager上面

define(function(require, exports, module){
	//store缓存池
	var storePool = {};

	exports.registStore = function(name, store){
		if(!name || !store){
			return false;
		}
	}
});