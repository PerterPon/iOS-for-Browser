
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'Content', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderMove' ],
                [ 'sliderUp' ]
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
                Event  = window.iOS.Event,
                dis    = evtPos.pageX - sttc.startPos;
            Event.dispatchEvent( 'multiScreenTranslate', [ sttc.curIdx, dis >= 0 ? 'right' : 'left', dis ]);
            // Util.notify( Ctrl, 'sliderTranslate', [ evtPos.pageX - sttc.startPos, 0 ] );
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

        _handleChildCfg : function(){
            var sttc     = this.values,
                data     = sttc.data.data,
                curIdx   = typeof data[ 0 ] == 'object' ? 0 : data.shift(),
                AppIcon  = require( './AppIcon' ),
                CAppIcon = require( '../controller/CAppIcon' ),
                VAppIcon = require( '../view/VAppIcon' ),
                newCfg   = [];
            sttc.curIdx  = curIdx;
            for( var i   = 0; i < data.length; i++ ){
                newCfg.push({
                    "class"    : AppIcon,
                    "name"     : "appIcon_" + i,
                    "clsList"  : [ "iOS_iconScreen_appIcon", "iOS_iconScreen_appIcon_" + i, false == i ? "iOS_iconScreen_current" : "" ],
                    "controller"  : CAppIcon,
                    "view"     : VAppIcon,
                    "renderChild" : true,
                    "index"    : i,
                    "current"  : i == curIdx,
                    "data"     : {
                        "data" : data[ i ]
                    }
                });
            }
            sttc.data.data = newCfg;
        },

        _initComplete : function(){
            this.callParent();
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller;
            Util.notify( ctrl, 'activeDot', [ sttc.curIdx ] );
        },

        __getTouchPos : function( event, isTouchEnd ){
            return $.support.touch ? isTouchEnd ? event.originalEvent.touches[ 0 ] : event.originalEvent.changedTouches[ 0 ] : event;
        },
    });

    return Content;
});