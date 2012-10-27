
define( function( require, exports, module ){
    "use strick";

    require( './IconContent' );
    Ext.define( 'AppIcon', {
        extend : 'IconContent',

        _attachEventListener : function(){
            this.callParent();
            var sttc  = this.values,
                Event = window.iOS.Event;
            Event.addEvent( 'unlock', this.__unlockHandler, this );
        },

        __unlockHandler : function(){
            var sttc  = this.values,
                sttcs = this.self,
                ctrl  = sttc.controller,
                Util  = sttcs.Util;
            Util.notify( ctrl, 'unlock' );
        }

    });

    return AppIcon;
});