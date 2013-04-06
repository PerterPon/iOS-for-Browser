
define( function( require, exports, module ){
    //"use strict";

    require( './BaseView' );
    Ext.define( 'VAppScreen', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'openApp' ],
                [ 'closeApp' ],
                [ 'clearApp' ],
                [ 'reopenApp' ]
            ]
        },

        values : {
            appContainer : null,
            curAppName   : null
        },

        _initView : function(){
            this.callParent();
            //向外暴露appScreen
            window.iOS.appScreen = this;
        },

        EopenApp : function( appname ) {
            var appContainer = this._getEl();
            this.values.curAppName = appname;
            setTimeout( function(){
                appContainer[ 0 ].style.webkitTransform = 'scale3d( 1, 1, 1 )';
            }, 1 );
        },

        EcloseApp : function() {
            var appContainer = this._getEl(),
                backEnd      = window.iOS.BackEnd;
            backEnd.addApp( this.values.curAppName, appContainer.children() );
            appContainer[ 0 ].style.webkitTransform = 'scale3d( 0, 0, 0 )';
            appContainer[ 0 ].addEventListener( 'webkitTransitionEnd', appContainerAnimComplete );
            function appContainerAnimComplete(){
                this.removeEventListener( 'webkitTransitionEnd', appContainerAnimComplete );
            }
        },

        EclearApp : function() {
            this._getEl().html( '' );
        },

        EreopenApp : function( DOMObject ) {
            this._getEl().html( DOMObject );
        }

    });

    return VAppScreen;
});