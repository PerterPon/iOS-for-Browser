
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'IconScreen', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'unlock' ]
            ]
        },

        statics : {
            Event : window.iOS.Event
        },

        constructor : function( cfg ){
            this.callParent([ cfg ]);
            console.log( cfg );
        },

        _attachEventListener : function(){
            this.callParent();
            var sttc  = this.self,
                Event = sttc.Event;
            Event.addEvent( 'unlock', this.__unlockHandler, this );
        },

        _getDefaultData : function(){
            return require( '../../resource/defaultData/iconScreen/iconScreen' );
        },

        _handleChildCfg : function(){
            var sttc      = this.self,
                data      = sttc._data.data,
                Content   = require( './Content' ),
                AppIcon   = require( './AppIcon' ),
                VAppIcon  = require( '../view/VAppIcon' ),
                CAppIcon  = require( '../controller/CAppIcon' ),
                DockIcon  = require( './DockIcon' ),
                VDockIcon = require( '../view/VDockIcon' ),
                CDockIcon = require( '../controller/CDockIcon' ),
                newCfg    = [{
                    "class"   : Content,
                    "_name"   : "iconContent",
                    "clsList" : [ "iOS_content", "iOS_content_appContent" ],
                    "_data"   : {
                        data  : data[ 'screen' ]
                    },
                    "renderChild" : true
                }, {
                    "class"   : DockIcon,
                    "_name"   : "dockIcon",
                    "clsList" : [ "iOS_iconScreen_dockIcon" ],
                    "view"    : VDockIcon,
                    "controller" : CDockIcon,
                    "_data"   : {
                        data  : data[ 'dock' ]
                    },
                    "renderChild" : true
                }];
            
            sttc._data.data = newCfg;
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