
define( function( require, exports, module ) {
    // "use strict";
    var iterator  = require( '../Iterator' ),
        AppCenter = require( './AppCenter' );
    Ext.define( 'BackEnd', {

        statics : {
            iFrameCls : 'iOS_app_iframe'
        },

        /**
         * [_cacheMap 缓存列表]
         * @type {Object}
         */
        _cacheMap : {},

        /**
         * [_appCenter app中心]
         * @type {[AppCenter]}
         */
        _appCenter : null,

        _appScreen : null,

        constructor : function() {
            this.__initAppCenter();
            this._attachEventListener();
        },

        __initAppCenter : function() {
            var appCenter = new AppCenter();
            $.extend( window.iOS.AppCenter, appCenter );
        },

        __openAppHandler : function( appname, config ) {
            var DOMObject, appCfg,
                cacheMap  = this._cacheMap,
                Event     = window.iOS.Event;
            Event.dispatchEvent( 'clearApp' );
            if( config && config.isIframe ) {
                this.__addIframeApp( config.URL );
            } else {
                if( cacheMap[ name ] ) {
                    DOMObject = cacheMap[ name ].getDomObject();
                } else {
                    seajs.use( './script/config/' + appname, function( appCfg ) {
                        if( !appCfg ){
                            return;
                        }
                        iterator.setPreDom( window.iOS.AppCenter[ 'screenId' ].replace( '#', '' ) );
                        iterator.itrtrView( appCfg );
                    } );
                }
            }
        },

        __addIframeApp : function( URL ) {
            var iframe   = document.createElement( 'iframe' );
            this._appScreen || ( this._appScreen = document.getElementById( window.iOS.AppCenter.screenId.replace( '#', '' ) ) );
            iframe.classList.add( this.self.iFrameCls );
            iframe.style.width  = window.iOS.System.width + 'px';
            iframe.style.height = window.iOS.System.height + 'px'; 
            iframe.src   = URL;
            this._appScreen.appendChild( iframe );
        },

        _attachEventListener : function() {
            var Event = window.iOS.Event;
            Event.addEvent( 'openApp', this.__openAppHandler, this );
        },

        /**
         * [open 打开一个app，首先会从缓存列表中进行查找，若没有找到，则会进行app的初始化]
         * @return {[void]} []
         */
        open : function( appname ) {
            this.__openAppHandler( appname );
        },

        /**
         * [destructor 析构函数，当某个App需要注销时，可以调用此函数]
         * @return {[void]}
         */
        destructor : function( name ) {
            _cacheMap[ name ].destructor();
            delete _cacheMap[ name ];
        }

    } );

    return BackEnd;

} );