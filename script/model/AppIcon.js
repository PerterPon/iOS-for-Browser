
define( function( require, exports, module ){
    "use strick";

    require( './IconContent' );
    Ext.define( 'AppIcon', {
        extend : 'IconContent',

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

        __unlockHandler : function(){
            var sttc = this.self,
                ctrl = sttc.controller,
                Util = sttc.Util;
            Util.notify( ctrl, 'unlock' );
        }

    });

    return AppIcon;
});