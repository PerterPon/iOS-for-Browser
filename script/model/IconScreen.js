
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'IconScreen', {
        extend : 'BaseModel',

        statics : {
            Event : window.iOS.Event
        },

        _getDefaultData : function(){
            return require( '../../resource/defaultData/iconScreen/iconScreen' );
        },

        _attachEventListener : function(){
            this.callParent();
            var sttc  = this.self,
                Event = sttc.Event;
            Event.addEvent( 'unlock', this.__unlockHandler, this );
        },

        _iteratorChild : function(){
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
            this.callParent();
        },

        __unlockHandler : function(){
            var sttc = this.self,
                ctrl = sttc.controller,
                Util = sttc.Util;
            Util.notify( ctrl, 'unlock' );
        }

    });

    return IconScreen;
});