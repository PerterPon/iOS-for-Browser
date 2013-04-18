
define( function( require, exports, module ) {
    // "use strict";

    require( './BaseView' );
    Ext.define( 'VMaskScreen', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'showMask' ],
                [ 'hideMask' ]
            ]
        },

        EshowMask : function( suspendedName ) {
            var sttc      = this.values,
                sttcs     = this.self,
                suspended = this.manager.get( 'V'+ suspendedName ),
                susIndex  = suspended.getEl().css( 'zIndex' );
            this._getEl().show().css( 'zIndex', susIndex - 1 );
        },

        EhideMask : function() {
            this._getEl().hide();
        },

        _attachDomEvent : function() {
            this.callParent();
            var that = this;
            this._getEl().on( 'click', function( event ) {
                event.stopPropagation();
                that.self.Util.notify( that.values.controller, 'maskClick' );
            } );
        }
    } );

    return VMaskScreen;

} );