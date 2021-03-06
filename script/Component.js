//所有类的基类
define( function( require, exports, module ) {
    //"use strict";

    Ext.define( 'Component', {

        /**
         * [inheritableStatics]
         * @type {Object}
         * @protected
         */
        inheritableStatics : {
            Util : require( '../util/Util' ),
            /**
             * [eventList 需要添加的事件列表]
             * @type {Array}
             * @example: [
             *     [ eventName, eventBody, tarObj, scope ]
             * ]
             * eventBody的名称默认和eventName一致;
             */
            eventList : []
        },

        /**
         * [values]
         * @type {Object}
         * @private
         */
        values : {},

        constructor : function( cfg ) {
            this._clearValues();
            this._applyCfg( cfg );
            this._registerSelf();
            this._attachEventListener();
        },

        _clearValues : function() {
            this.values = {};
        },

        _applyCfg : function( cfg ) {
            var sttc  = this.values;
            for( var i in cfg ) {
                if( 'subView' === i ) {
                    continue;
                }
                sttc[ i ] = cfg[ i ];
            }
        },

        _registerSelf : function() {
            var sttc    = this.values,
                manager = this.manager;
            manager.register( sttc.name, this );
        },

        /**
         * 添加事件
         * @return {void}
         */
        _attachEventListener : function() {
            var sttcs   = this.self,
                events  = sttcs.eventList,
                Util    = sttcs.Util,
                that    = this,
                manager = sttcs.manager,
                view, eventName, eventBody, scope;
            for( var i  = 0; i < events.length; i++ ) {
                view    = that;
                eventName = events[ i ][ 0 ];
                Util.listen( view, eventName, view[ 'E' + eventName ], that );
            }
        }
    });

    return Component;
});