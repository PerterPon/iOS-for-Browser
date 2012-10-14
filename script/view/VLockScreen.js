
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VLockScreen', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'unlock' ]
            ],
            week : [ '日', '一', '二', '三', '四', '五', '六' ]
        },

        statics : {
            topBarHeight: 20,
            lockDate    : 'iOS_lockScreen_lockDate',
            lockTime    : 'iOS_lockScreen_lockTime',
            lockDateInfo: 'iOS_lockScreen_lockDateInfo', 
            lockSlider  : 'iOS_lockScreen_lockSlider',
            sldrCntinr  : 'iOS_lockScreen_sliderContainer',
            sldrImg     : 'iOS_lockScreen_sliderImg',
            slider      : 'iOS_lockScreen_slider'
        },

        __updateTime : function( time ){
            var sttc     = this.self,
                lockTime = this._getElByCls( sttc.lockTime ),
                lockDate = this._getElByCls( sttc.lockDateInfo );
            lockTime.text( time.hours + ':' + time.minute );
            lockDate.text( time.month + '月' + time.day + ' ' + '星期' + sttc.week[ time.weekDay ] );
        },

        _attachEventListener : function(){
            this.callParent();
            window.iOS.Event.addEvent( 'updateTime', this.__updateTime, this );
        },

        _initInnerDom : function(){
            var sttc     = this.self,
                htmlData = '<div class="'+ sttc.lockDate +' abs">' +
                    '<div class="'+ sttc.lockTime +'">12:00</div>' +
                    '<div class="'+ sttc.lockDateInfo +'">12月12日 星期四</div>' +
                '</div>' + 
                '<div class="'+ sttc.lockSlider +' abs">' +
                    '<div class="'+ sttc.sldrCntinr +'">' +
                        '<div class="'+ sttc.sldrImg +'"></div>' +
                        '<img class="'+ sttc.slider +'" draggable="false" src="./resource/images/lockStuff/lockSlider.png" />' +
                    '</div>' +
                '</div>';
            this._getEl().html( htmlData );
            var date  = new Date(),
                time  = {
                    year   : date.getFullYear(),
                    month  : date.getMonth() + 1,
                    day    : date.getDate(),
                    weekDay: date.getDay(),
                    hours  : date.getHours(),
                    minute : date.getMinutes(),
                    second : date.getSeconds()
                };
            this.__updateTime( time );
        },

        _attachDomEvent : function(){
            this.callParent();
            var sttc = this.self,
                ctrl = sttc.ctrl,
                Util = sttc.Util;
            this._getElByCls( sttc.slider ).bind( $.support.touchstart, function( event ){
                Util.notify( ctrl, 'sliderDown', [ event ]);
            }).bind( $.support.touchmove, function( event ){
                Util.notify( ctrl, 'sliderMove', [ event ]);
            }).bind( $.support.touchstop, function( event ){
                Util.notify( ctrl, 'sliderUp', [ event ]);
            });
        },

        Eunlock : function(){
            var sttc       = this.self,
                lockDate   = this._getElByCls( sttc.lockDate ),
                lockSlider = this._getElByCls( sttc.lockSlider );
            lockDate[ 0 ].style.webkitTransform   = 'translate3d( 0, -'+ ( lockDate.height() + sttc.topBarHeight ) +'px, 0 )';
            lockSlider[ 0 ].style.webkitTransform = 'translate3d( 0, '+ lockSlider.height() +'px, 0)';
        }

    });

    return VLockScreen;
});