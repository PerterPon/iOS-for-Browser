
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
            var sttc     = this.self,
                basePath = './resource/images/status/',
                htmlData = '<div class="'+ sttc.leftIcon +' abs">' +
                    '<img src="'+ ( basePath + 'signal.png' ) +'" class="'+ sttc.signalCls +' '+ sttc.barIcon +'" />' + 
                    '<img src="'+ ( basePath + 'ATT.png' ) +'" class="'+ sttc.attCls +' '+ sttc.barIcon +'" />' +
                    '<img src="'+ ( basePath + 'WiFi.png' ) +'" class="'+ sttc.wifi +' '+ sttc.barIcon +'" />' +
                '</div>' +
                '<div class="'+ sttc.centerIcon +'">' +
                    '<img src="'+ ( basePath + 'lock.png' ) +'" class="'+ sttc.lock +' '+ sttc.barIcon +'" />' +
                '</div>' +
                '<div class="'+ sttc.rightIcon +' abs">' +
                    '<div class="'+ sttc.percent +'">100%</div>' + 
                    '<img src="'+ ( basePath + 'battery.png' ) +'" class="'+ sttc.battery +' '+ sttc.barIcon +'" />' +
                '</div>'
            this._getEl().html( htmlData );
        }
    });

    return VTopBar;
});