
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VAppIcon', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'translate' ]
            ]
        },

        statics : {
            width : window.iOS.System.width
        },

        values  : {
            slider : null
        },

        Etranslate : function( x, y, isOri ){
            var sttc  = this.values,
                sttcs = this.self;
            sttc.slider[ 0 ].style.webkitTransform = 'translate3d('+ ( x + sttcs.width * ( isOri == true ? 0 : 1 )) +'px, '+ y +'px, 0)'; 
        },

        _initView : function(){
            this.callParent();
            var sttc       = this.values,
                sttcs      = this.self,
                current    = sttc.cfg.current,
                thisScreen = this._getEl();
            sttc.slider    = thisScreen;
            if( !current )
                thisScreen[ 0 ].style.webkitTransform = 'translate3d('+ sttcs.width +'px, 0, 0)';  
        }
    });

    return VAppIcon;
});