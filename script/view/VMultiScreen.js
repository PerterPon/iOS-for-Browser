
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VMultiScreen', {
        extend  : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'addDot' ],
                [ 'removeDot' ],
                [ 'activeDot' ]
            ]
        },

        statics : {
            carouselBox : 'iOS_multiScreen_carouselBox',
            carouselDot : 'iOS_multiScreen_carouselDot',
            carouselCur : 'iOS_multiScreen_carouselCur',
            DotHtml     : '<span class="iOS_multiScreen_carouselDot"></span>'
        },

        EaddDot : function(){
            var sttcs = this.self;
            this._getElCacheByCls( sttcs.carouselBox ).append( sttcs.DotHtml );
        },

        EremoveDot : function(){
            var sttcs = this.self;
            this._getElCacheByCls( sttcs.carouselDot ).last().remove();
        },

        EactiveDot : function( index ){
            var sttcs  = this.self,
                dots   = this._getElByCls( sttcs.carouselDot ),
                curCls = sttcs.carouselCur; 
            dots.removeClass( curCls ).eq( index ).addClass( curCls );
        },

        _initInnerDom : function(){
            var sttcs  = this.self,
                sttc   = this.values,
                dots   = sttc.cfg.data.data.length,
                html   = '<div class="'+ sttcs.carouselBox +'">';
            for( var i = 0; i < dots; i++ ){
                html += sttcs.DotHtml;
            }
            html += '</div>';
            this._getEl().append( html );
        },

        _attachDomEvent : function(){
            this.callParent();
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller; 
            this._getEl().on( $.support.touchstart, function( event ){
                Util.notify( ctrl, 'sliderDown', [ event ] );
            }).on( $.support.touchmove, function( event ){
                Util.notify( ctrl, 'sliderMove', [ event ] );
            }).on( $.support.touchstop, function( event ){
                Util.notify( ctrl, 'sliderUp', [ event ] );
            });
        }

    });

    return VMultiScreen;
});