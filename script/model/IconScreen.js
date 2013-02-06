
define( function( require, exports, module ) {
    //"use strict";

    require( './BaseModel' );
    Ext.define( 'IconScreen', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'unlock' ]
            ]
        },

        _attachEventListener : function() {
            this.callParent();
            var sttc  = this.values,
                Event = window.iOS.Event;
            Event.addEvent( 'unlockComplete', this.__unlockHandler, this );
        },

        _getDefaultData : function() {
            return require( '../../resource/defaultData/iconScreen/iconScreen' );
        },

        _handleChildCfg : function() {
            var sttc      = this.values,
                data      = sttc.data.data,
                MultiScreen = require( './MultiScreen' ),
                VMultiScreen= require( '../view/VMultiScreen' ),
                CMultiScreen= require( '../controller/CMultiScreen' ),
                AppIcon   = require( './AppIcon' ),
                VAppIcon  = require( '../view/VAppIcon' ),
                CAppIcon  = require( '../controller/CAppIcon' ),
                DockIcon  = require( './DockIcon' ),
                VDockIcon = require( '../view/VDockIcon' ),
                CDockIcon = require( '../controller/CDockIcon' ),
                newCfg    = [ {
                    "class"    : MultiScreen,
                    "name"     : "multiScreen",
                    "clsList"  : [ "iOS_multiScreen" ],
                    "view"     : VMultiScreen,
                    "controller"  : CMultiScreen,
                    "data"     : {
                        data   : data[ 'screen' ]
                    },
                    "renderChild" : true
                }, {
                    "class"   : DockIcon,
                    "name"    : "dockIcon",
                    "clsList" : [ "iOS_iconScreen_dockIcon" ],
                    "view"    : VDockIcon,
                    "controller" : CDockIcon,
                    "data"    : {
                        data  : data[ 'dock' ]
                    },
                    "renderChild" : true
                } ];
            sttc.data.data = newCfg;
        },

        __unlockHandler : function() {
            var sttc  = this.values,
                sttcs = this.self,
                ctrl  = sttc.controller,
                Util  = sttcs.Util;
            Util.notify( ctrl, 'unlock' );
        }

    } );

    return IconScreen;
} );