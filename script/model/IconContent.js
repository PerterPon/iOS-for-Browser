
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'IconContent', {
        extend : 'BaseModel',

        _handleChildCfg : function(){
            var sttc  = this.self,
                data  = sttc._data.data,
                icon  = require( './Icon' ),
                VIcon = require( '../view/VIcon' ),
                CIcon = require( '../controller/CIcon' );
            for( var i   = 0; i < data.length; i++ ){
                data[ i ][ 'class' ]   = icon;
                data[ i ][ 'clsList' ] = [ 'iOS_icon', 'iOS_icon_' + data[ i ][ '_name' ] ];
                data[ i ][ 'view' ]    = VIcon;
                data[ i ][ 'controller' ] = CIcon;
                data[ i ][ 'index' ]   = i;
            }
        }
    });

    return IconContent;
});