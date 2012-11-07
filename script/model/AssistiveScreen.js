
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'AssistiveScreen', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'touchstart' ],
                [ 'touchmove' ],
                [ 'touchstop' ],
                [ 'assistivePointAutoTranslateComplete' ]
            ]
        },

        statics : {
            assistivePointWidth  : 55,
            assistivePointHeight : 55
        },

        values : {
            touchStartHandleFunc : null,
            touchMoveHandleFunc  : null,
            touchStopHandleFunc  : null,
            pointTranslating     : false
        },

        Etouchstart : function( event ){
            this.values.touchStartHandleFunc( event );
        },

        Etouchmove : function( event ){
            this.values.touchMoveHandleFunc( event );
        },

        Etouchstop : function( event ){
            this.values.touchStopHandleFunc( event );
        },

        EassistivePointAutoTranslateComplete : function(){
            this.values.pointTranslating = false;
        },

        _attachEventListener : function(){
            this.callParent();
            window.iOS.Event.addEvent( 'unlock', this.__unlockHandle, this );
        },

        _initComplete : function(){
            var sttc       = this.values,
                touchFuncs = this.__getTouchStartStopFunc();
            sttc.touchStartHandleFunc = touchFuncs[ 'touchStart' ];
            sttc.touchMoveHandleFunc  = touchFuncs[ 'touchMove' ];
            sttc.touchStopHandleFunc  = touchFuncs[ 'touchStop' ];
        },

        __unlockHandle : function(){
            this.self.Util.notify( this.values.controller, 'showAssistivePoint' );
        },

        __getTouchStartStopFunc : function(){
            var sttc     = this.values,
                sttcs    = this.self,
                that     = this,
                Util     = sttcs.Util,
                ctrl     = sttc.controller,
                dragging = false,
                height   = window.iOS.System.height,
                width    = window.iOS.System.width,
                boundary = height - sttcs.assistivePointWidth,
                curPos   = {
                    x : 0,
                    y : 0
                },
                startPos;
            return {
                touchStart : touchStart,
                touchMove  : touchMove,
                touchStop  : touchStop
            };
            function touchStart( event ){
                if( sttc.pointTranslating )
                    return;
                var evtPos = that._getTouchPos( event );
                startPos   = {
                    x : evtPos.pageX,
                    y : evtPos.pageY
                };
                // Util.notify( ctrl, 'disableTransparent' );
                dragging   = true;
            }

            function touchMove( event ){
                if( !dragging || sttc.pointTranslating )
                    return;
                var evtPos = that._getTouchPos( event ),
                    posDis = {
                        x : evtPos.pageX - startPos.x + curPos.x,
                        y : evtPos.pageY - startPos.y + curPos.y
                    };
                Util.notify( ctrl, 'translate', [ posDis ] );
            }

            function touchStop( event ){
                if( sttc.pointTranslating )
                    return;
                var evtPos = that._getTouchPos( event, true ),
                    nowPos = {
                        x : evtPos.pageX - startPos.x + curPos.x,
                        y : evtPos.pageY - startPos.y + curPos.y
                    },
                    tarPos = {
                        x : null,
                        y : nowPos.y > 0 ? nowPos.y > boundary ? boundary : nowPos.y : 0
                    };
                tarPos.x   = ( ( nowPos.x + sttcs.assistivePointWidth / 2 ) > width / 2 ) && ( width - sttcs.assistivePointWidth ) || 0;
                curPos     = tarPos;
                Util.notify( ctrl, 'assistivePointAutoTranslate', [ tarPos ] );
                sttc.pointTranslating = true;
                dragging   = false;
            }
        }
    });

    return AssistiveScreen;
});