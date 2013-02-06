
define( function( require, exports, module ) {
    //"use strict";

    require( './BaseModel' );
    Ext.define( 'TopBar', {
        extend : 'BaseModel',

        values : {
            'status'  : {
                unlock : false
            }
        },

        _attachEventListener : function() {
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'unlock', this.__unlockHandle, this );
            Event.addEvent( 'openApp', this.__openAppHandle, this );
            Event.addEvent( 'closeApp', this.__closeAppHandle, this );
        },

        _clearValues : function() {
            this.callParent();
            this.values.status = {};
        },

        __unlockHandle : function() {
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller,
                Event = window.iOS.Event,
                time  = window.iOS.Time;
            if( !sttc.status.unlock ) {
                Event.addEvent( 'updateTime', this.__unlockHandle, this );
                sttc.status.unlock = true;
            }
            Util.notify( ctrl, 'updateTime', [ time ] );
        },

        __openAppHandle : function( appname, topBarCfg ) {
            topBarCfg[ 'show' ] && this.self.Util.notify( this.values.controller, 'hideTopbar' );
            topBarCfg[ 'color' ] && this.self.Util.notify( this.values.controller, 'changeColor', [ topBarCfg[ 'color' ] ] );
        },

        __closeAppHandle : function() {
            this.self.Util.notify( this.values.controller, 'rollBackTopbar' );
        }
    });

    return TopBar;
} );