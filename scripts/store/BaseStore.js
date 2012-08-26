
define(function(require, exports, module){
	Ext.define('BaseStore', {

		inheritableStatics : {
			//store的ID，唯一
			name : null
		},

		statics: {

		},

		constructor: function(name){
			this.registStore(name, this);
		},

		registStore: function(name, store){

		}

	});

	return BaseStore;
});