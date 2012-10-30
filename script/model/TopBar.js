
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'TopBar', {
        extend : 'BaseModel',

        values : {
            'status'  : {
                unlock : false
            }
        },

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'unlock', this.__unlockHandle, this );
        },

        _clearValues : function(){
            this.callParent();
            this.values.status = {};
        },

        __unlockHandle : function(){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller,
                Event = window.iOS.Event,
                time  = window.iOS.Time;
            if( !sttc.status.unlock ){
                Event.addEvent( 'updateTime', this.__unlockHandle, this );
                sttc.status.unlock = true;
            }
            Util.notify( ctrl, 'updateTime', [ time ] );
        }
    });

    return TopBar;
});