
define( function( require ){
    "use strick";

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
            this.self.preDom = $( '#' + id )[ 0 ];
        },

        __doItrtr : function( tCfg, dom ){
            var sttc   = this.self,
                module, cls, id, html, instance, preDom, cfg;
            for( var i = 0; i < tCfg.length; i++ ){
                cfg    = tCfg[ i ];
                module = cfg[ 'class' ];
                cls    = '';
                id     = 'ios-' + sttc.curIdx;
                for( var j = 0; j < cfg.clsList.length; j++ ){
                    cls += cfg.clsList[ j ] + ' ';
                }
                html    = document.createElement( 'div' );
                html.id = id;
                html.className = cls;
                if( cfg.flex )
                    html.style[ '-webkit-box-flex' ] = cfg.flex;
                if( cfg.height )
                    html.style[ 'height' ] = cfg.height;
                if( cfg.width )
                    html.style[ 'width' ]  = cfg.width;
                preDom = dom || sttc.preDom || document.body;
                preDom.appendChild( html );
                cfg[ 'selector' ] = '#' + id;
                instance = new module( cfg );
                sttc.curIdx++;
                if( cfg.subView && cfg.subView.length ){
                    this.__doItrtr( cfg.subView, html );
                }
            }
        }

    });

    return new Iterator();
});