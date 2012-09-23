
define( function( require, exports, module ){
    "use strick";

    require( '../Component' );
    Ext.define( 'BaseModel', {  
        extend : 'Component',

        inheritableStatics : {
            manager : require( './ModelManager' )
        },

        statics : {

            name : null

        },

        constructor : function( cfg ){
            this.callParent([ cfg ]);
            this._initController();
            this._initView();
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
                    _name   : 'V' + sttc._name,
                    visiable: sttc.visiable,
                    selector: sttc.selector
                };
            sttc.view = new view( viewCfg );
        },

        /**
         * [_initController 初始化controller]
         * @return  {}
         * @private
         */
        _initController : function(){
            var sttc = this.self,
                ctrl = sttc.controller;
            sttc.controller = new ctrl( sttc.ctrlCfg );
        }

    });

    return BaseModel;
});