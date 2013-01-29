
define( function( require, exports, module ){
    "use strict";

    require( './IconContent' );
    Ext.define( 'DockIcon', {
        extend : 'IconContent',

        statics : {
            dock : true
        },

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'iconIn', this.__iconInHandle,   this );
            Event.addEvent( 'iconOut', this.__iconOutHandle, this )
        },

        __iconInHandle : function(){
            this.self.Util.notify( this.values.controller, 'showBorder' );
        },

        __iconOutHandle : function(){
            this.self.Util.notify( this.values.controller, 'hideBorder' );
        }

    });

    return DockIcon;
});