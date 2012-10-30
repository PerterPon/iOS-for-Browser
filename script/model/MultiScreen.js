
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

        statics : {
            width : window.iOS.System.width
        },

        values  : {
            startPos : null,
            sliding  : false,
            lastPos  : null,
            curIdx   : null
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
            sttc.lastPos    = evtPos.pageX;
            if( ( !sttc.curIdx && dis > 0 ) || ( sttc.curIdx == sttc.data.data.length - 1 && dis < 0 ) ){
                dis *= 0.5;
                if( dis >= sttcs.width / 2 - 10 )
                    return;
            }
            Event.dispatchEvent( 'multiScreenTranslate', [ sttc.curIdx, dis >= 0 ? 'right' : 'left', dis ]);
            delete sttc;
            delete evtPos;
            delete distance;
        },

        EsliderUp   : function( event ){
            var sttc   = this.values,
                sttcs  = this.self,
                evtPos = this.__getTouchPos( event, true ),
                ctrl   = sttc.controller,
                Util   = sttcs.Util,
                Event  = window.iOS.Event,
                dis    = evtPos.pageX - sttc.startPos;
            if( ( !sttc.curIdx && dis > 0 ) || ( sttc.curIdx == sttc.data.data.length - 1 && dis < 0 ) ){
                dis *= 0.5;
                if( dis >= sttcs.width / 2 - 10 )
                    dis = sttcs.width / 2 - 10;
            }
            Event.dispatchEvent( 'multiScreenAutoTranslate', [ sttc.curIdx, dis >= 0 ? 'right' : 'left', Math.abs( dis ) ] );
            this.values.sliding = false;
        },

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'multiScreenAutoTranslateComplete', this.__multiScreenAutoTranslateComplete, this );
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
            return $.support.touch ? isTouchEnd ? event.originalEvent.changedTouches[ 0 ] : event.originalEvent.touches[ 0 ] : event;
        },

        __multiScreenAutoTranslateComplete : function( curPos, curIdx ){
            if( 0 == curPos ){
                var sttc  = this.values,
                    sttcs = this.self,
                    Util  = sttcs.Util,
                    ctrl  = sttc.controller; 
                sttc.curIdx = curIdx;
                Util.notify( ctrl, 'activeDot', [ curIdx ] );
            }
                
        }
    });

    return Content;
});