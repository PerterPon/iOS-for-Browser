
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
         * @return  {void}
         * @protected
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
         * @return  {void}
         * @protected
         */
        _initController : function(){
            var sttc = this.self,
                ctrl = sttc.controller;
            sttc.controller = new ctrl( sttc.ctrlCfg );
        },

        /**
         * [_requestData 向后台请求数据]
         * @return  {void} []
         * @protected
         */
        _requestData : function(){
            
        },

        /**
         * [_getData 获取数据]
         * @return  {Object} [取得的数据]
         * @private
         */
        _getData : function(){
            return this.self.data;
        }

    });

    return BaseModel;
});