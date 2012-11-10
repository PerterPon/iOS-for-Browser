
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
                [ 'enableTransparent' ],
                [ 'renderChild' ]
            ]
        },

        values : {
            assistivePoint : null
        },

        statics : {
            assistiveArea     : 'iOS_assistive_area',
            assistiveIcon     : 'iOS_assistive_icon',
            assistiveHome     : 'iOS_assistive_home',
            assistiveFavorites: 'iOS_assistive_favorites',
            assistiveGestures : 'iOS_assistive_gestures',
            assistiveDevice   : 'iOS_assistive_device'
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

        ErenderChild : function( renderData ){
            var sttc  = this.values,
                sttcs = this.self,
                html  = "<div class="+ sttcs.assistiveArea + ">"+
                    "<div class="+ sttcs.assistiveHome +"></div>"+
                    "<div class="+ sttcs.assistiveFavorites +"></div>"+
                    "<div class="+ sttcs.assistiveGestures +"></div>"+
                    "<div class="+ sttcs.assistiveDevice +"></div>"+
                "</div>",
                icons;
            this._getEl().html( html );
            icons = this._getElByCls( sttcs.assistiveIcon );
            html = "<div class="+ sttcs.assistiveArea + ">";
            for( var i = 0, data, pos; i < icons.length; i++ ){
                data   = renderData[ i ];
                pos    = data[ 'position' ];
                html  += "<div class="+ sttcs.assistiveHome +" style=-webkit-transform:translate3d("+ pos.x +"px,"+ pos.y +"px, 0)>"+
                    "<img src=./resource/images/assistive/"+ data[ 'name' ] +".png />"+
                    "<span>"+ data[ 'text' ] +"</span>"
                "</div>";
            }
        },

        _initInnerDom : function(){
            var html  = "<div class="+ this.self.assistiveArea + "></div>";
            this._getEl().html( html );
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
            this._getElCacheByCls( sttc.assistiveArea )[ 0 ].addEventListener( 'webkitTransitionEnd', function( event ){
                event.stopPropagation();
            });
        },

        _afterRender : function(){
            var sttc = this.values;
            sttc.assistivePoint = this._getEl()[ 0 ];
        }

    });

    return VAssistiveScreen;
});