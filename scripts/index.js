seajs.config({
	'charset': 'utf-8',
	'debug'  : true
});

seajs.use('scripts/store/BaseStore', function(store){
	console.log(store);
	//var testStore = new store();
});