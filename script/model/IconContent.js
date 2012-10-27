
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'IconContent', {
        extend : 'BaseModel',

        _handleChildCfg : function(){
            var sttc  = this.self,
                data  = sttc._data.data;
                require( './Icon' );
                require( '../view/VIcon' );
                require( '../controller/CIcon' );
            for( var i= 0; i < data.length; i++ ){
                $.extend( data[ i ], {
                    "class"   : Icon,
                    "clsList" : [ 'iOS_icon', 'iOS_icon_' + data[ i ][ '_name' ] ],
                    "view"    : VIcon,
                    "controller" : CIcon,
                    "index"   : i,
                    "current" : sttc.index == false,
                    "dock"    : sttc.dock ? true : false
                });
            }
        }
    });

    return IconContent;
});