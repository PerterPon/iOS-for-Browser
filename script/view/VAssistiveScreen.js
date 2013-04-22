
define( function() {
    //"use strict";

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
                [ 'showAssistiveOptions' ],
                [ 'hideAssistiveOptions' ]
            ]
        },

        values : {
            assistivePoint    : null,
            basePoint         : null
        },

        statics : {
            //FIXME:宽度变化比位移变化要少，所以宽度的运行速度会更加快一些。
            assistiveDuration   : '300ms,280ms,280ms',
            assistiveIconWidth  : 57,
            assistiveIconHeight : 57,
            assistiveWidth      : 270,
            assistiveHeight     : 270,
            assistiveAlpha      : 0.5,
            assistiveIcon       : 'iOS_assistive_icon',
            assistiveBasePoint  : 'iOS_assistive_basePoint',
            assistiveHome       : 'iOS_assistive_home',
            assistiveFavorites  : 'iOS_assistive_favorites',
            assistiveGestures   : 'iOS_assistive_gestures',
            assistiveDevice     : 'iOS_assistive_device'
        },

        EshowAssistivePoint : function() {
            this._getEl().show();
        },

        Etranslate : function( position ) {
            this._getEl()[ 0 ].style.webkitTransform = 'translate3d('+ position.x +'px, '+ position.y +'px, 0)';
        },

        EassistivePointAutoTranslate : function( position ) {
            var icon  = this._getEl()[ 0 ],
                sttc  = this.values,
                sttcs = this.self;
            icon.style.webkitTransitionDuration = sttcs.assistiveDuration;
            icon.style.webkitTransform = 'translate3d('+ position.x +'px, '+ position.y +'px, 0)';
            icon.addEventListener( 'webkitTransitionEnd', autoTranslateComplete );
            function autoTranslateComplete( event ) {
                event.stopPropagation();
                icon.style.webkitTransitionDuration = '0';
                icon.removeEventListener( 'webkitTransitionEnd', autoTranslateComplete );
                sttcs.Util.notify( sttc.controller, 'assistivePointAutoTranslateComplete' );
            }
        },

        EdisableTransparent : function() {
            this._getEl().css( 'opacity', '1' );
        },

        EenableTransparent : function() {
            this._getEl().css( 'opacity', '0.5' );
        },

        ErenderChild : function( renderData ) {
            var sttc  = this.values,
                sttcs = this.self,
                icons = renderData[ 'icon' ],
                html  = "",
                area, style, funcIcon;
            for( var i = 0, data, pos; i < icons.length; i++ ) {
                data  = icons[ i ];
                pos   = data[ 'position' ];
                style = 'background-image:url(./resource/images/assistive/'+ data[ 'name' ] +'.png);display:none'
                html  =
                '<div class="'+ sttcs[ 'assistive'+ data[ 'text' ] ] +" "+ sttcs.assistiveIcon +'" name='+ data[ "name" ] +' style='+ style +'>'+
                    '<span>'+ data[ 'text' ] +'</span>'+
                '</div>';
                funcIcon = $( html ).click( this.__funcIconClickHandle );
                this._getEl().append( funcIcon );
            }
        },

        EshowAssistiveOptions : function( position, secondaryIcon ) {
            var sttcs = this.self,
                icon  = this._getEl()[ 0 ],
                that  = this;
            icon.style.webkitTransitionDuration = sttcs.assistiveDuration;
            this._getElCacheByCls( sttcs.assistiveBasePoint ).css( {
                opacity : 0 
            } );
            icon.style.webkitTransform = 'translate3d('+ position.x +'px, '+ position.y +'px, 0)';
            this._getEl().css( {
                width   : sttcs.assistiveWidth + 'px',
                height  : sttcs.assistiveHeight + 'px',
                opacity : 1
            } );
            icon.addEventListener( 'webkitTransitionEnd', areaTransitionEnd );
            function areaTransitionEnd( event ) {
                event.stopPropagation();
                this.removeEventListener( 'webkitTransitionEnd', areaTransitionEnd );
                // document.body.addEventListener( 'click', that.__bodyClickHandle );
                that.self.Util.notify( that.values.controller, 'showAssistiveOptionsComplete' );
            }
            for( var i in secondaryIcon ) {
                this._getElCacheByCls( 'iOS_assistive_' + i ).show().css( 'opacity', '0' );
                ( function( i ) {
                    setTimeout( function() {
                        that._getElCacheByCls( 'iOS_assistive_' + i ).css( {
                            opacity : 1,
                            webkitTransform : 'translate3d('+ secondaryIcon[ i ].x +'px, '+ secondaryIcon[ i ].y +'px, 0)'
                        } );
                    }, 1 );
                } )( i );
            }
        },

        EhideAssistiveOptions : function( position, secondaryIcon ) {
            var icon  = this._getEl(),
                sttcs = this.self,
                that  = this,
                fucIconStyle;
            document.body.removeEventListener( 'click', this.__bodyClickHandle );
            icon[ 0 ].style.webkitTransitionDuration = sttcs.assistiveDuration;
            icon.css( {
                webkitTransform : 'translate3d('+ position.x +'px,'+ position.y +'px, 0)',
                width  : sttcs.assistiveIconWidth + 'px',
                height : sttcs.assistiveIconHeight + 'px'
            } );
            icon[ 0 ].addEventListener( 'webkitTransitionEnd', iconTransCompelte );
            function iconTransCompelte( event ) {
                event.stopPropagation();
                this.style.webkitTransitionDuration = '0';
                this.removeEventListener( 'webkitTransitionEnd', iconTransCompelte );
                sttcs.Util.notify( that.values.controller, 'assistiveHideComplete' );
            }
            this._getElCacheByCls( sttcs.assistiveBasePoint ).css( {
                opacity : 1
            } );
            for( var i in secondaryIcon ) {
                this._getElCacheByCls( 'iOS_assistive_' + i ).css( {
                    webkitTransform : 'translate3d(0,0,0)',
                    opacity : 0
                } )[ 0 ].addEventListener( 'webkitTransitionEnd', tranEndFuc );
            }
            function tranEndFuc( event ) {
                event.stopPropagation();
                this.removeEventListener( 'webkitTransitionEnd', tranEndFuc );
                this.style.display = 'none';
            }
        },

        _initInnerDom : function() {
            var sttcs = this.self,
                html  =
                '<div class="'+ sttcs.assistiveBasePoint +' '+ sttcs.assistiveIcon +'">' + 
                '</div>';
            this._getEl().html( html );
        },

        _attachDomEvent : function() {
            var sttcs = this.values,
                sttc  = this.self,
                Util  = sttc.Util,
                ctrl  = sttcs.controller;
            this._getEl().on( $.support.touchstart, function( event ) {
                event.stopPropagation();
                Util.notify( ctrl, 'touchstart', [ event ] );
            } ).on( $.support.touchmove, function( event ) {
                Util.notify( ctrl, 'touchmove', [ event ] );
                return false;
            } ).on( $.support.touchstop, function( event ) {
                event.stopPropagation();
                Util.notify( ctrl, 'touchstop', [ event ] );
            } );
            this._getEl()[ 0 ].addEventListener( 'webkitTransitionEnd', function( event ) {
                event.stopPropagation();
            });
            this.__bodyClickHandle     = Util.bind( this.__bodyClickHandle, this );
            this.__funcIconClickHandle = Util.bind( this.__funcIconClickHandle, this );
        },

        __bodyClickHandle : function( event ) {
            var sttcs = this.self;
            sttcs.Util.notify( this.values.controller, 'assistiveOptionsClick', [ event ] );
        },

        __funcIconClickHandle : function( event ) {
            event.stopPropagation();
            var sttcs = this.self;
            sttcs.Util.notify( this.values.controller, 'assistiveFuncIconClick', [ event ] );
        }

    } );

    return VAssistiveScreen;
} );