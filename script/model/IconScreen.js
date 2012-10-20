
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'IconScreen', {
        extend : 'BaseModel',

        _attachEventListener : function(){
            this.callParent();
        },

        _getDefaultData : function(){
            return require( '../../resource/defaultData/iconScreen/iconScreen' );
        },

        _initInnerDom : function(){
            
        }

    });

    return IconScreen;
});