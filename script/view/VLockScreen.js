
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VLockScreen', {
        extend : 'BaseView',

        statics : {
            lockDate    : 'iOS_lockScreen_lockDate',
            lockTime    : 'iOS_lockScreen_lockTime',
            lockDateInfo: 'iOS_lockScreen_lockDateInfo', 
            lockSlider  : 'iOS_lockScreen_lockSlider',
            sldrCntinr  : 'iOS_lockScreen_sliderContainer',
            slider      : 'iOS_lockScreen_slider'
        },

        _initInnerDom : function(){
            var sttc     = this.self,
                htmlData = '<div class="'+ sttc.lockDate +' abs">' +
                    '<div class="'+ sttc.lockTime +'">12:00</div>' +
                    '<div class="'+ sttc.lockDateInfo +'">12月12日 星期四</div>' +
                '</div>' + 
                '<div class="'+ sttc.lockSlider +' abs">' +
                    '<div class="'+ sttc.sldrCntinr +'">' +
                        '<img class="'+ sttc.slider +'" draggable="false" src="./resource/images/lockStuff/lockSlider.png" />' +
                    '</div>' +
                '</div>';
            this._getEl().html( htmlData );
        },

        _attachDomEvent : function(){
            this.callParent();
            var sttc = this.self,
                ctrl = sttc.ctrl,
                Util = sttc.Util;
            this._getElByCls( sttc.slider ).bind( $.support.mousedown, function( event ){
                Util.notify( ctrl, 'sliderDown', [ event ]);
            }).bind( $.support.mousemove, function( event ){
                Util.notify( ctrl, 'sliderMove', [ event ]);
            }).bind( $.support.mouseup, function( event ){
                Util.notify( ctrl, 'sliderUp', [ event ]);
            });
        }
        
    });

    return VLockScreen;
});