
define( function( require, exports, module ){
    "use strick";

    var mdlMngr = require( './module/ModuleManager' );
    Ext.define( 'Iterator', {

        statics : {
            curIdx : 0,
            preDom : null
        },

        /**
         * [itrtrView 迭代实例化配置文件信息]
         * @param  {[type]} cfg [配置文件信息]
         * @return {void}
         */
        itrtrView : function( cfg ){
            var sttc = this.self;
            this.__doItrtr( cfg );
        },

        /**
         * [setPreDom 设置当前配置文件的父节点ID]
         * @param {[type]} id [父节点ID]
         */
        setPreDom : function( id ){
            this.self.preDom = $( '#' + id );
        },

        __doItrtr : function( cfg ){
            var sttc   = this.self, 
                module = cfg.class,
                cls    = '',
                id     = 'ios-' + sttc.curIdx,
                html, instance;
            for( var i = 0; i < cfg.clsList.length; i++ ){
                cls += cfg.clsList[ i ] + ' ';
            }
            html = $( '<div id="'+ id +'" class="'+ cls +'"></div>' );
            sttc.preDom.append( html );
            instance = new module( cfg );
            mdlMngr.register( cfg.name, instance );
            sttc.preDom = html;
            sttc.curIdx++;
            if( cfg.subView && cfg.subView.length ){
                for( i = 0; i < cfg.subView.length; i++ ){
                    this.__doItrtr( cfg.subView[ i ]);
                }
            }
        }

    });

    return new Iterator();
});