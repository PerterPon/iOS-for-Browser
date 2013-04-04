
define( function( require, exports, module ) {
    //"use strict";

    require( './BaseModel' );
    Ext.define( 'AppScreen', {
        extend : 'BaseModel',

        values : {
            /**
             * [curAppName 当前打开的app的名字]
             */
            curAppName : null,
        },

        _attachEventListener : function() {
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'openApp', this.__openAppHandle, this );
            Event.addEvent( 'closeApp', this.__closeAppHandle, this );
            Event.addEvent( 'clearApp', this.__clearAppHandle, this );
            Event.addEvent( 'reopenApp', this.__reopenAppHandle, this );
            // Event.addEvent( 'iconOut', this.__iconOutHandle, this );
            // Event.addEvent( 'iconIn', this.__iconInHandle, this );
        },

        _initComplete : function() {
            this.callParent();
            var sttc = this.values;
            window.iOS.AppCenter = {};
            window.iOS.AppCenter[ 'screenId' ] = sttc.selector;
        },

        __clearAppHandle : function() {
            this.self.Util.notify( this.values.controller, 'clearApp' );
        },

        __closeAppHandle : function() {
            this.self.Util.notify( this.values.controller, 'closeApp' );
        },

        __openAppHandle : function( appname, hideTopBar ) {
            this.self.Util.notify( this.values.controller, 'openApp', [ appname ] );
        },

        __reopenAppHandle : function( DOMObject ) {
            this.self.Util.notify( this.values.controller, 'reopenApp', [ DOMObject ] );
        }

    });

    return AppScreen;
});