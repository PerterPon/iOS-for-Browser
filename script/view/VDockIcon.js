
define( function( require, exports, module ){
    //"use strict";

    require( './BaseView' );
    Ext.define( 'VDockIcon', {
        extend : 'BaseView',

        statics : {
            dockBorderCls : 'iOS_iconScreen_dockBorder',
            borderHeight  : 90
        },

        inheritableStatics : {
            eventList : [
                [ 'showBorder' ],
                [ 'hideBorder' ]
            ]
        },

        _initInnerDom : function(){
            var sttcs = this.self, 
                html  = '<div class="'+ sttcs.dockBorderCls +'"></div>';
            this._getEl().append( html );
        },

        EshowBorder : function(){
            var sttcs = this.self;
            this._getElCacheByCls( sttcs.dockBorderCls )[ 0 ].style.webkitTransform 
                = "translate3d( 0, 0, 0 ) rotateX( 50deg )";;
        },

        EhideBorder : function(){
            var sttcs = this.self;
            this._getElCacheByCls( sttcs.dockBorderCls )[ 0 ].style.webkitTransform 
                = 'translate3d(0,'+ sttcs.borderHeight +'px,0) rotateX(50deg)';
        }

    });

    return VDockIcon;
});