
define( function( require, exports, module ) {
    // "use strict";

    require( './BaseModel' );
    Ext.define( 'MaskScreen', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'maskClick' ]
            ]
        },

        values : {
            maskClicker : null,
            color       : 'rgba( 255, 255, 255, 0 )',
            alpha       : 0
        },

        EmaskClick : function( event ) {
            var sttc = this.values;
            sttc[ 'maskClicker' ] && sttc[ 'maskClicker' ]();
        },

        _attachEventListener : function() {
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'showMask', this.__showMask, this );
            Event.addEvent( 'hideMask', this.__hideMask, this );
        },

        __showMask : function( maskCfg ) {
            var sttc  = this.values,
                sttcs = this.self,
                util  = sttcs.Util,
                item;
            for( item in maskCfg ) {
                sttc[ item ] = maskCfg[ item ];
            }
            util.notify( sttc.controller, 'showMask', [ sttc.suspendedName ] );
        },

        __hideMask : function() {
            this.__initMask();
            this.self.Util.notify( this.values.controller, 'hideMask' );
        },

        /**
         * [__initMask 初始化mask配置信息,目前可配置项有透明度,颜色,以及单击事件]
         * @return {[type]} [description]
         */
        __initMask : function() {
            var sttc = this.values;
            sttc[ 'maskClicker' ] = null;
            sttc[ 'color' ]       = 'rgba( 255, 255, 255, 0 )';
            sttc[ 'alpha' ]       = 0;
        }

    } );

    return MaskScreen;
} );