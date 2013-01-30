
define( function( require, exports, module ){
    //"use strict";

    require( './BaseView' );
    Ext.define( 'VLockScreen', {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'unlock' ],
                [ 'sliderTranslate' ],
                [ 'sliderBack' ],
                [ 'updateTime' ]
            ]
        },

        statics : {
            topBarHeight: 20,
            lockDate    : 'iOS_lockScreen_lockDate',
            lockTime    : 'iOS_lockScreen_lockTime',
            lockDateInfo: 'iOS_lockScreen_lockDateInfo', 
            lockSlider  : 'iOS_lockScreen_lockSlider',
            sldrCntinr  : 'iOS_lockScreen_sliderContainer',
            sldrImg     : 'iOS_lockScreen_sliderImg',
            slider      : 'iOS_lockScreen_slider',
            week        : [ '日', '一', '二', '三', '四', '五', '六' ]
        },

        values : {
            sliderImg : null,
            slider    : null
        },

        Eunlock : function(){
            var sttc       = this.values,
                sttcs      = this.self,
                that       = this,
                Util       = sttcs.Util,
                ctrl       = sttc.controller,
                lockDate   = this._getElByCls( sttcs.lockDate ),
                lockSlider = this._getElByCls( sttcs.lockSlider );
            lockDate[ 0 ].style.webkitTransform   = 'translate3d( 0, -'+ ( lockDate.height() + sttcs.topBarHeight ) +'px, 0 )';
            lockSlider[ 0 ].style.webkitTransform = 'translate3d( 0, '+ lockSlider.height() +'px, 0)';
            lockDate[ 0 ].addEventListener( 'webkitTransitionEnd', function(){
                that._getEl().hide();
                Util.notify( ctrl, 'unlockComplete' );
                this.removeEventListener( 'webkitTransitionEnd' );
            });
        },

        EsliderTranslate : function( x, y ){
            var sttc = this.values;
            this.__doSetSliderPos( x, y );
            sttc.sliderImg[ 0 ].style.opacity = 1 - x / 120;
        },

        EsliderBack : function(){
            var sttc      = this.values,
                slider    = sttc.slider[ 0 ],
                sliderImg = sttc.sliderImg[ 0 ];
            slider.style.webkitTransitionDuration = '300ms';
            slider.style.webkitTransform = 'translate3d( 0, 0, 0 )';
            sliderImg.style.webkitTransitionDuration = '300ms';
            sliderImg.style.opacity = '1';
            slider.addEventListener( 'webkitTransitionEnd', translateCompleHandle );
            function translateCompleHandle(){
                slider.style.webkitTransitionDuration = '0ms';
                sliderImg.style.webkitTransitionDuration = '0ms';
                slider.removeEventListener( 'webkitTransitionEnd', translateCompleHandle );
            }
        },

        EupdateTime : function( time ){
            this.__updateTime( time );
        },

        _initInnerDom : function(){
            var sttcs     = this.self,
                sttc      = this.values,
                htmlData = '<div class="'+ sttcs.lockDate +' abs">' +
                    '<div class="'+ sttcs.lockTime +'">12:00</div>' +
                    '<div class="'+ sttcs.lockDateInfo +'">12月12日 星期四</div>' +
                '</div>' +
                '<div class="'+ sttcs.lockSlider +' abs">' +
                    '<div class="'+ sttcs.sldrCntinr +'">' +
                        '<div class="'+ sttcs.sldrImg +'"></div>' +
                        '<img class="'+ sttcs.slider +'" draggable="false" src="./resource/images/lockStuff/lockSlider.png" />' +
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
            window.iOS.Time = time;
            this.__updateTime( time );
            sttc.slider    = this._getElByCls( sttcs.slider );
            sttc.sliderImg = this._getElByCls( sttcs.sldrImg );
        },

        _attachDomEvent : function(){
            this.callParent();
            var sttc  = this.values,
                sttcs = this.self, 
                ctrl  = sttc.controller,
                Util  = sttcs.Util;
            sttc.slider.on( $.support.touchstart, function( event ){
                Util.notify( ctrl, 'sliderDown', [ event ]);
            }).bind( $.support.touchmove, function( event ){
                Util.notify( ctrl, 'sliderMove', [ event ]);
            }).bind( $.support.touchstop, function( event ){
                Util.notify( ctrl, 'sliderUp', [ event ]);
            });
        },

        __updateTime : function( time ){
            var sttcs    = this.self,
                lockTime = this._getElByCls( sttcs.lockTime ),
                lockDate = this._getElByCls( sttcs.lockDateInfo );
            lockTime.text( time.hours + ':' + time.minute );
            lockDate.text( time.month + '月' + time.day + '日 ' + '星期' + sttcs.week[ time.weekDay ] );
        },

        __doSetSliderPos : function( x, y ){
            var slider = this.values.slider[ 0 ];
            slider.style.webkitTransform = 'translate3d( '+ x +'px, '+ y +'px, 0 )';
        }

    });

    return VLockScreen;
});