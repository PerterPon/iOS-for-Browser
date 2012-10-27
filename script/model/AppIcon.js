
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

        values : {
            sliding : false
        },

        EsliderDown : function( event ){
            var sttc   = this.values,
                evtPos = this.__getTouchPos( event ); 
            sttc.startPos = evtPos.pageX;
            sttc.sliding  = true;
        },

        EsliderMove : function( event ){
            var sttc   = this.values;
            if( !sttc.sliding )
                return;
            var sttcs  = this.self,
                evtPos = this.__getTouchPos( event ),
                Util   = sttcs.Util,
                Ctrl   = sttc.controller;
            Util.notify( Ctrl, 'sliderTranslate', [ evtPos.pageX - sttc.startPos, 0 ] );
            delete sttc;
            delete evtPos;
            delete distance;
        },

        EsliderUp   : function( event ){
            // var sttc   = this.values,
            //     sttcs  = this.self,
            //     Util   = sttcs.Util,
            //     Ctrl   = sttc.controller;
            //     evtPos = this.__getTouchPos( event );
            // if( evtPos.pageX - sttc.startPos < 207 && evtPos.pageX - sttc.startPos > 0 ){
            //     Util.notify( Ctrl, 'sliderBack' );
            // } else {
            //     var Event = window.iOS.Event;
            //     Event.dispatchEvent( 'unlock' );
            // }
            this.values.sliding = false;
        },

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
        },

        __getTouchPos : function( event, isTouchEnd ){
            return $.support.touch ? isTouchEnd ? event.originalEvent.touches[ 0 ] : event.originalEvent.changedTouches[ 0 ] : event;
        },

    });

    return AppIcon;
});