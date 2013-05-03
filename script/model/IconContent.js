
define( function( require, exports, module ) {
    //"use strict";

    require( './BaseModel' );
    Ext.define( 'IconContent', {
        extend : 'BaseModel',

        _handleChildCfg : function() {
            var sttc  = this.values,
                sttcs = this.self,
                data  = sttc.data.data;
                require( './Icon' );
                require( '../view/VIcon' );
                require( '../controller/CIcon' );
            for( var i= 0; i < data.length; i++ ) {
                $.extend( data[ i ], {
                    "class"   : Icon,
                    "clsList" : [ 'iOS_icon', 'iOS_icon_' + data[ i ][ 'name' ] ],
                    "view"    : VIcon,
                    "controller" : CIcon,
                    "index"   : i,
                    "current" : sttc.current == true,
                    "screenIdx"  : sttc.index,
                    "dock"    : sttcs.dock ? true : false
                } );
            }
        }
    });

    return IconContent;
});