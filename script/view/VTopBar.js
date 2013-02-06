
define( function( require, exports, module ) {
    //"use strict";

    require( './BaseView' );
    Ext.define( 'VTopBar', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'updateTime' ],
                [ 'hideTopbar' ],
                [ 'topBarBlack' ],
                [ 'rollBackTopbar' ],
                [ 'changeColor' ]
            ]
        },

        statics : {
            barIcon   : 'iOS_topBar_icon',
            signalCls : 'iOS_topBar_signal',
            attCls    : 'iOS_topBar_att',
            wifi      : 'iOS_topBar_wifi',
            lock      : 'iOS_topBar_lock',
            time      : 'iOS_topBar_time',
            percent   : 'iOS_topBar_percent',
            battery   : 'iOS_topBar_battery',
            leftIcon  : 'iOS_topBar_leftIcon',
            rightIcon : 'iOS_topBar_rightIcon',
            centerIcon: 'iOS_topBar_centerIcon',
            topBarInitinfo : {
                'background': 'rgba( 0, 0, 0, 0.3 )',
                'marginTop' : '0'
            }
        },

        values : {
            topBarHeight : null,
            topBarColor  : null
        },

        EupdateTime : function( time ) {
            this.__updateTimeHandler( time );
        },

        EhideTopbar : function() {
            this._getEl().css( 'marginTop', '-'+ this.values.topBarHeight +'px' );
        },

        ErollBackTopbar : function() {
            this._getEl().css( this.self.topBarInitinfo );
        },

        EtopBarBlack : function() {
            this._getEl().css( 'background', 'rgba( 255, 255, 255, 1 )' );
        },

        EchangeColor : function( color ) {
            this[ '__changeColor2' + color.toUpperCase() ]();
        },

        _initInnerDom : function() {
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
            this.values.topBarHeight = this._getEl().height();
        },

        __updateTimeHandler : function( time ) {
            var sttcs      = this.self,
                centerIcon = this._getElByCls( sttcs.centerIcon ),
                htmlData   = '<span class='+ sttcs.time +'>'+ time.hours +':'+ time.minute +'</span>';
            centerIcon.html( htmlData );
        },

        __changeColor2BLACK : function() {
            this._getEl()[ 0 ].style.background = 'rgba(0,0,0,1)';
        }
    } );

    return VTopBar;
} );