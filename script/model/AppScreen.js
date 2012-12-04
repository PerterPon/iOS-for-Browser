
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'AppScreen', {
        extend : 'BaseModel',

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'openApp', this.__openAppHandle, this );
            Event.addEvent( 'closeApp', this.__closeAppHandle, this );
            // Event.addEvent( 'iconOut', this.__iconOutHandle, this );
            // Event.addEvent( 'iconIn', this.__iconInHandle, this );
        },

        __closeAppHandle : function(){
            this.self.Util.notify( this.values.controller, 'closeApp' );
        },

        __openAppHandle : function(){
            this.self.Util.notify( this.values.controller, 'openApp' );
        }

    });

    return AppScreen;
});