
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
            sldrCntinr  : 'iOS_lockScreen_sliderContainer'
        },

        _initInnerDom : function(){
            var sttc     = this.self,
                htmlData = '<div class="'+ sttc.lockDate +' abs">' +
                    '<div class="'+ sttc.lockTime +'">12:00</div>' +
                    '<div class="'+ sttc.lockDateInfo +'">12月12日 星期四</div>' +
                '</div>' + 
                '<div class="'+ sttc.lockSlider +' abs">' +
                    '<div class="'+ sttc.sldrCntinr +'"></div>' +
                '</div>';
            this._getEl().html( htmlData );
        }
        
    });

    return VLockScreen;
});