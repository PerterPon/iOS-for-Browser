
define( function( require, exports, module ){
    //"use strict";

    require( './BaseView' );
    Ext.define( 'VAppScreen', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'openApp' ],
                [ 'closeApp' ],
                [ 'clearApp' ]
            ]
        },

        values : {
            appContainer : null
        },

        _initInnerDom : function(){
        },

        EopenApp : function() {
            var appContainer = this._getEl()[ 0 ];
            // appContainer.style.display = '';
            setTimeout( function(){
                appContainer.style.webkitTransform = 'scale3d( 1, 1, 1 )';
            }, 1 );
        },

        EcloseApp : function() {
            var appContainer = this._getEl()[ 0 ];
            appContainer.style.webkitTransform = 'scale3d( 0, 0, 0 )';
            appContainer.addEventListener( 'webkitTransitionEnd', appContainerAnimComplete );
            function appContainerAnimComplete(){
                this.removeEventListener( 'webkitTransitionEnd', appContainerAnimComplete );
            }
        },

        EclearApp : function() {
            this._getEl().html( '' );
        }

    });

    return VAppScreen;
});