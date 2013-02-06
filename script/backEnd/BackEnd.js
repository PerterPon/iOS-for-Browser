
define( function( require, exports, module ) {
    // "use strict";
    var iterator = require( '../Iterator' );
    Ext.define( 'BackEnd', {

        /**
         * [_cacheMap 缓存列表]
         * @type {Object}
         */
        _cacheMap : {},

        constructor : function() {
            this._attachEventListener();
        },

        __openAppHandler : function( appname ) {
            var DOMObject, appCfg,
                cacheMap  = this._cacheMap,
                Event     = window.iOS.Event;
            Event.dispatchEvent( 'clearApp' );
            if( cacheMap[ name ] ) {
                DOMObject = cacheMap[ name ].getDomObject();
            } else {
                appCfg = require( '../config/notes' );
                iterator.setPreDom( window.iOS.AppCenter[ 'screenId' ].replace( '#', '' ) );
                iterator.itrtrView( appCfg );
            }
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