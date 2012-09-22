
define( function( require, exports, module ){
    "use strick";

    Ext.define( 'BaseModel', {

        inheritableStatics : {
            manager : require( './ModelManager' );
        },

        statics : {

            name : null,


        },

        constructor : function( cfg ){
            this.callParent([ cfg ]);
            this._initController();
        },

        /**
         * [_initView 初始化view]
         * @return  {}
         * @private
         */
        _initView : function(){
            var sttc    = this.self,
                view    = sttc.view,
                viewCfg = {
                    clsList : sttc.clsList,
                    name    : 'V' + sttc.name
                };
            sttc._view = new view( viewCfg );
        },

        /**
         * [_initController 初始化controller]
         * @return  {}
         * @private
         */
        _initController : function(){
            var sttc = this.self,
                ctrl = sttc.controller;
            sttc._controller = new ctrl( sttc.ctrlCfg );
        }

    });

    return BaseModel;
});