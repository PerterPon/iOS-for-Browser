
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VAssistiveScreen', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'showAssistivePoint' ],
                [ 'translate' ],
                [ 'assistivePointAutoTranslate' ],
                [ 'disableTransparent' ],
                [ 'enableTransparent' ]
            ]
        },

        values : {
            assistivePoint : null
        },

        EshowAssistivePoint : function(){
            this._getEl().show();
        },

        Etranslate : function( position ){
            this.values.assistivePoint.style.webkitTransform = 'translate3d( '+ position.x +'px, ' + position.y +'px, 0 )';
        },

        EassistivePointAutoTranslate : function( position ){
            var point = this.values.assistivePoint,
                sttc  = this.values,
                sttcs = this.self;
            //FIXME
            point.style.webkitTransitionDuration = '300ms';
            point.style.webkitTransitionDelay    = '100ms';
            point.style.webkitTransform          = 'translate3d('+ position.x +'px, '+ position.y +'px, 0)';
            point.addEventListener( 'webkitTransitionEnd', translateEndFunc );
            function translateEndFunc( event ){
                event.stopPropagation();
                this.style.webkitTransitionDuration = '0';
                this.style.webkitTransitionDelay    = '0';
                this.removeEventListener( 'webkitTransitionEnd', translateEndFunc );
                sttcs.Util.notify( sttc.controller, 'assistivePointAutoTranslateComplete' );
            }
        },

        EdisableTransparent : function(){
            this._getEl().css( 'opacity', '1' );
        },

        EenableTransparent : function(){
            this._getEl().css( 'opacity', '0.5' );
        },

        _attachDomEvent : function(){
            var sttcs = this.values,
                sttc  = this.self,
                Util  = sttc.Util,
                ctrl  = sttcs.controller;
            this._getEl().on( $.support.touchstart, function( event ){
                Util.notify( ctrl, 'touchstart', [ event ] );
            }).on( $.support.touchmove, function( event ){
                Util.notify( ctrl, 'touchmove', [ event ] );
            }).on( $.support.touchstop, function( event ){
                Util.notify( ctrl, 'touchstop', [ event ] );
            });
        },

        _afterRender : function(){
            var sttc = this.values;
            sttc.assistivePoint = this._getEl()[ 0 ];
        }

    });

    return VAssistiveScreen;
});