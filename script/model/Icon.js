
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'Icon', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'iconClick' ]
            ]
        },

        values : {
            inPos  : {
                x  : null,
                y  : null
            },
            outPos : {
                x  : null,
                y  : null
            }
        },

        EiconClick : function(){
            var Event = window.iOS.Event;
            Event.dispatchEvent( 'iconOut' );
        },

        _initComplete : function(){
            var sttc  = this.values,
                sttcs = this.self;
            this.__calPosition();
            sttcs.Util.notify( sttc.controller, 'initComplete', [ sttc.inPos, sttc.outPos ] );
        },

        _attachEventListener : function(){
            this.callParent();
            var Event = window.iOS.Event;
            Event.addEvent( 'iconOut', this.__iconOut, this );
            Event.addEvent( 'iconIn', this.__iconIn, this );
        },

        /**
         * [__calPosition 计算图标的位置]
         * @return {}
         */
        __calPosition : function(){
            var sttc = this.values,
                idx  = sttc.index;
            sttc.inPos  = this.__getInPosition( idx );
            sttc.outPos = this.__getOutPosition( idx ); 
        },

        /**
         * [__getInPosition 获取图标在屏幕里面时候的位置]
         * @param  {Number} index [图标对应的index值，从上往下，从左往右]
         * @return {Object}       [相应的位置信息]
         */
        __getInPosition : function( index ){
            var posX   = index % 4,
                posY   = Math.floor( index / 4 ),
                disX   = 17 * ( posX + 1 ) + 58 * posX + 3 * Math.floor( posX.toString( 2 ) / 10 ),
                disY   = posY * 82 + ( posY & 2 ) * 4 + 10,
                System = window.iOS.System;
            return {
                x : disX / 320 * System.width,
                y : disY / 480 * System.height
            };
        },

        /**
         * [__getOutPosition 获取图标在屏幕外面时候的位置]
         * @param  {Number} index [图标对应的index值，从上往下，从左往右]
         * @return {Object}       [相应的位置信息]
         */
        __getOutPosition : function( index ){
            var sttc   = this.values,
                posY   = Math.floor( index / 4 ),
                posX   = index % 4,
                posIn  = this._posIn,
                disX   = ( posX & 2 ) - 1,
                disY   = ( posY & 2 ) - 1,
                System = window.iOS.System;
            return {
                x : sttc.dock ? sttc.inPos.x : ( sttc.inPos.x + 160 * disX ) / 320 * System.width,
                y : sttc.dock ? 90 : ( sttc.inPos.y + 140 * disY ) / 480 * System.height
            };
        },

        __iconIn : function(){
            var sttc  = this.values,
                sttcs = this.self;
            if( sttc.current || sttc.dock )
                sttcs.Util.notify( sttc.controller, 'iconIn' );
        },

        __iconOut : function(){
            var sttc  = this.values,
                sttcs = this.self;
            if( sttc.current || sttc.dock )
                sttcs.Util.notify( sttc.controller, 'iconOut' );
        }
    });
    window.iOS.Icon = Icon;
    // return Icon;
});
