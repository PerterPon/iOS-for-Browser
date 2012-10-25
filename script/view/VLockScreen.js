
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VLockScreen', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'unlock' ],
                [ 'sliderTranslate' ],
                [ 'sliderBack' ]
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

        Eunlock : function(){
            var sttc       = this.self,
                that       = this,
                Util       = sttc.Util,
                ctrl       = sttc.controller,
                lockDate   = this._getElByCls( sttc.lockDate ),
                lockSlider = this._getElByCls( sttc.lockSlider );
            lockDate[ 0 ].style.webkitTransform   = 'translate3d( 0, -'+ ( lockDate.height() + sttc.topBarHeight ) +'px, 0 )';
            lockSlider[ 0 ].style.webkitTransform = 'translate3d( 0, '+ lockSlider.height() +'px, 0)';
            lockDate[ 0 ].addEventListener( 'webkitTransitionEnd', function(){
                that._getEl().hide();
                Util.notify( ctrl, 'unlockComplete' );
                this.removeEventListener( 'webkitTransitionEnd' );
            });
        },

        EsliderTranslate : function( x, y ){
            var sttc = this.self;
            this.__doSetSliderPos( x, y );
            sttc.sliderImg[ 0 ].style.opacity = 1 - x / 120;
        },

        EsliderBack : function(){
            var sttc      = this.self,
                slider    = sttc.slider[ 0 ],
                sliderImg = sttc.sliderImg[ 0 ];
            slider.style.webkitTransitionDuration = '300ms';
            slider.style.webkitTransform = 'translate3d( 0, 0, 0 )';
            sliderImg.style.webkitTransitionDuration = '300ms';
            sliderImg.style.opacity = '1';
            slider.addEventListener( 'webkitTransitionEnd', function(){
                slider.style.webkitTransitionDuration = '0ms';
                sliderImg.style.webkitTransitionDuration = '0ms';
                slider.removeEventListener( 'webkitTransitionEnd' );
            });
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
                    hours  : date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
                    minute : date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                };
            this.__updateTime( time );
            sttc.slider    = this._getElByCls( sttc.slider );
            sttc.sliderImg = this._getElByCls( sttc.sldrImg ); 
        },

        _attachDomEvent : function(){
            this.callParent();
            var sttc = this.self,
                ctrl = sttc.controller,
                Util = sttc.Util;
            sttc.slider.on( $.support.touchstart, function( event ){
                Util.notify( ctrl, 'sliderDown', [ event ]);
            }).bind( $.support.touchmove, function( event ){
                Util.notify( ctrl, 'sliderMove', [ event ]);
            }).bind( $.support.touchstop, function( event ){
                Util.notify( ctrl, 'sliderUp', [ event ]);
            });
        },

        __updateTime : function( time ){
            var sttc     = this.self,
                lockTime = this._getElByCls( sttc.lockTime ),
                lockDate = this._getElByCls( sttc.lockDateInfo );
            lockTime.text( time.hours + ':' + time.minute );
            lockDate.text( time.month + '月' + time.day + ' ' + '星期' + sttc.week[ time.weekDay ] );
        },

        __doSetSliderPos : function( x, y ){
            var slider = this.self.slider[ 0 ];
            slider.style.webkitTransform = 'translate3d( '+ x +'px, '+ y +'px, 0 )';
        }

    });

    return VLockScreen;
});