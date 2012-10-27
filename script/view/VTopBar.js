
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VTopBar', {
        extend : 'BaseView',

        statics : {
            barIcon   : 'iOS_topBar_icon',
            signalCls : 'iOS_topBar_signal',
            attCls    : 'iOS_topBar_att',
            wifi      : 'iOS_topBar_wifi',
            lock      : 'iOS_topBar_lock',
            percent   : 'iOS_topBar_percent',
            battery   : 'iOS_topBar_battery',
            leftIcon  : 'iOS_topBar_leftIcon',
            rightIcon : 'iOS_topBar_rightIcon',
            centerIcon: 'iOS_topBar_centerIcon'
        },

        _initInnerDom : function(){
            var sttcs     = this.self,
                basePath = './resource/images/status/',
                htmlData = '<div class="'+ sttcs.leftIcon +' abs">' +
                    '<img src="'+ ( basePath + 'signal.png' ) +'" class="'+ sttcs.signalCls +' '+ sttcs.barIcon +'" />' + 
                    '<img src="'+ ( basePath + 'ATT.png' ) +'" class="'+ sttcs.attCls +' '+ sttcs.barIcon +'" />' +
                    '<img src="'+ ( basePath + 'WiFi.png' ) +'" class="'+ sttcs.wifi +' '+ sttcs.barIcon +'" />' +
                '</div>' +
                '<div class="'+ sttcs.centerIcon +'">' +
                    '<img src="'+ ( basePath + 'lock.png' ) +'" class="'+ sttcs.lock +' '+ sttcs.barIcon +'" />' +
                '</div>' +
                '<div class="'+ sttcs.rightIcon +' abs">' +
                    '<div class="'+ sttcs.percent +'">100%</div>' + 
                    '<img src="'+ ( basePath + 'battery.png' ) +'" class="'+ sttcs.battery +' '+ sttcs.barIcon +'" />' +
                '</div>';
            this._getEl().html( htmlData );
        }
    });

    return VTopBar;
});