﻿
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
                [ 'renderChild' ],
                [ 'showAssistiveOptions' ]
            ]
        },

        values : {
            assistivePoint : null
        },

        statics : {
            assistiveArea     : 'iOS_assistive_area',
            assistiveTransArea: 'iOS_assistive_transArea',
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
                icons = renderData[ 'icon' ],
                html  = "", 
                area;
            for( var i = 0, data, pos; i < icons.length; i++ ){
                data   = icons[ i ];
                pos    = data[ 'position' ];
                html  += "<div class="+ sttcs[ 'assistive' + data[ 'text' ] ] +" style=-webkit-transform:translate3d("+ pos.x +"px,"+ pos.y +"px,0)>"+
                    "<img src=./resource/images/assistive/"+ data[ 'name' ] +".png />"+
                    "<span>"+ data[ 'text' ] +"</span>"+
                "</div>";
            }
            this._getElByCls( sttcs.assistiveTransArea ).html( html );
        },

        EshowAssistiveOptions : function( position ){
            var that = this;
            //FIXME:初步明白问题出在哪里了，可能主要还是因为之前的translate3d导致模糊，加上scale，于是模糊就加倍了，这里translate先采用left和top代替。
            this._getElCacheByCls( this.self.assistiveArea ).css('webkitTransform', 'matrix(1, 0, 0, 1, 0, 0)');/*.
                on( 'webkitTransitionEnd', function( event ){
                    event.stopPropagation();
                    $( this ).off( 'webkitTransitionEnd' ).find( 'img, span' ).css( 'webkitTransform', 'scale3d(1, 1, 1)' );
                });*/
            /*setTimeout( function(){
                that._getElCacheByCls( that.self.assistiveArea ).find( 'img' ).css( 'webkitTransform', 'scale3d(1, 1, 1)' );
            }, 1 );*/
            this._getElCacheByCls( this.self.assistiveTransArea ).css({
                left : position.x + 'px',
                top  : position.y + 'px'
            });
        },

        EhideAssistiveOptions : function(){
            this._getElCacheByCls( this.self.assistiveArea )[ 0 ].
                style.webkitTransform = 'scale3d( 0, 0, 0 )';
            this._getElCacheByCls( this.self.assistiveTransArea )[ 0 ].
                style.webkitTransform = 'translate3d(0 , 0, 0)';
        },

        _initInnerDom : function(){
            var sttcs = this.self,
                html  = "<div class="+ sttcs.assistiveArea +">"+
                    "<div class="+ sttcs.assistiveTransArea +"></div>"+
                "</div>";
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