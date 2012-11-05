
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'Home', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'homeButtonClick' ]
            ]
        },

        values : {
            shaking : false
        },

        EhomeButtonClick : function(){
            var Event = window.iOS.Event,
                sttc  = this.values;
            if( sttc.shaking ){
                sttc.shaking = false;
                Event.dispatchEvent( 'stopShake' );
            }
            else {
                Event.dispatchEvent( 'closeApp' );
                Event.dispatchEvent( 'iconIn' );
            }
        },

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'startShake', this.__stratShakeHandle, this );
        },

        __stratShakeHandle : function(){
            this.values.shaking = true;
        }

    });

    return Home;
});