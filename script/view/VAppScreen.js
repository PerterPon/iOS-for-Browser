
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VAppScreen', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'openApp' ],
                [ 'closeApp' ]
            ]
        },

        values : {
            appContainer : null
        },

        _initInnerDom : function(){
            this.values.appContainer = this._getEl();
        },

        EopenApp : function(){
            var appContainer = this.values.appContainer[ 0 ];
            // appContainer.style.display = '';
            setTimeout( function(){
                appContainer.style.webkitTransform = 'scale3d( 1, 1, 1 )';
            }, 1 );
        },

        EcloseApp : function(){
            var appContainer = this.values.appContainer[ 0 ];
            appContainer.style.webkitTransform = 'scale3d( 0, 0, 0 )';
            appContainer.addEventListener( 'webkitTransitionEnd', appContainerAnimComplete );
            function appContainerAnimComplete(){
                this.removeEventListener( 'webkitTransitionEnd', appContainerAnimComplete );

            }
        }

    });

    return VAppScreen;
});