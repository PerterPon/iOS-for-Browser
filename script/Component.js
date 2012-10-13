﻿//所有类的基类
define( function( require, exports, module ){
    "use strick";

    Ext.define( 'Component', {

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

        statics : {},

        constructor : function( cfg ){
            this._applyCfg( cfg );
            this._registerSelf();
            this._attachEventListener();
        },

        _applyCfg : function( cfg ){
            var sttc  = this.self;
            for( var i in cfg ){
                if( i == 'subView' )
                    continue;
                sttc[ i ] = cfg[ i ];
            }
        },

        _registerSelf : function(){
            var sttc    = this.self,
                manager = sttc.manager;
            manager.register( sttc._name, this );
        },

        /**
         * 添加事件
         * @return {void}
         */
        _attachEventListener : function(){
            var sttc   = this.self,
                events = sttc.eventList,
                Util   = sttc.Util,
                that   = this,
                manager= sttc.manager,
                view, eventName, eventBody, scope;
            for( var i = 0; i < events.length; i++ ){
                view   = manager.get( events[ i ][ 1 ] || that );
                eventName = events[ i ][ 0 ];
                Util.listen( view, eventName, view[ 'E' + eventName ], that );
            }
        }
    });

    return Component;
});