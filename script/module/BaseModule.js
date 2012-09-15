
define( function( require, exports, module ){
    "use strict";

    Ext.define( 'BaseModule', {

        inheritableStatics : {

        },

        statics : {
            name : null,

        },

        constructor : function( cfg ){
            this._applyCfg( cfg );
        },

        /**
         * 将配置文件中的信息保存到实例中去
         * @param   {Object} cfg 配置信息
         * @return  {void}
         */
        _applyCfg : function( cfg ){
            var sttc = this.self;
            for( var i in cfg ){
                if( i == 'subView' )
                    continue;
                sttc[ i ] = cfg[ i ];
            }
        }

        _initView : function( ){
            var sttc = this.self,
                view = Ext.ClassManager.get( sttc.view )
            sttc.viewInstance = new view( sttc.viewCfg );
        },

        _initController : function( ){
            var sttc = this.self,
                ctrl = Ext.ClassManager.get( sttc.controller );
            sttc.ctrlInstance = new ctrl( ctrlCfg );
        }

    });

    return BaseStore;
});