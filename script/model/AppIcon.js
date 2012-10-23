
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'AppIcon', {
        extend : 'BaseModel',

        statics : {
            Event : window.iOS.Event
        },

        constructor : function( cfg ){
            this.callParent([ cfg ]);
        },

        _attachEventListener : function(){
            this.callParent();
            var sttc  = this.self,
                Event = sttc.Event;
            Event.addEvent( 'unlock', this.__unlockHandler, this );
        },

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
            for( var i = 0, subView = newCfg[ 0 ][ 'subView' ]; i < data[ 'screen' ].length; i++ ){
                subView.push({
                    "class"   : AppIcon,
                    "_name"   : "appIcon_" + i,
                    "clsList" : [ "iOS_iconScreen_appIcon", "iOS_iconScreen_appIcon_" + i ],
                    "controller"  : CAppIcon,
                    "view"    : VAppIcon,
                    "multiScreen" : i == 0 ? false : true,
                    "renderChild" : true,
                    "_data"   : {
                        "data": data[ 'screen' ][ i ]
                    }
                });
            }
        },

        __unlockHandler : function(){
            var sttc = this.self,
                ctrl = sttc.controller,
                Util = sttc.Util;
            Util.notify( ctrl, 'unlock' );
        }

    });

    return AppIcon;
});