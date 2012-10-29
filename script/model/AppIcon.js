
define( function( require, exports, module ){
    "use strick";

    require( './IconContent' );
    Ext.define( 'AppIcon', {
        extend : 'IconContent',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderUp' ],
                [ 'sliderMove' ]
            ]
        },

        _attachEventListener : function(){
            this.callParent();
            var sttc  = this.values,
                Event = window.iOS.Event;
            Event.addEvent( 'unlock', this.__unlockHandler, this );
            Event.addEvent( 'multiScreenTranslate', this.__multiScreenTranslate, this );
        },

        __unlockHandler : function(){
            var sttc  = this.values,
                sttcs = this.self,
                ctrl  = sttc.controller,
                Util  = sttcs.Util;
            Util.notify( ctrl, 'unlock' );
        },

        __multiScreenTranslate : function( curIdx, direction, distance ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller,
                dis   = direction == 'left' ? 1 : -1;
            if( curIdx == sttc.index || curIdx + dis == sttc.index )
                Util.notify( ctrl, 'translate', [ distance, 0, curIdx == sttc.index ]); 
        }

    });

    return AppIcon;
});