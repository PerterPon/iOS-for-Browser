
define( function( require ){
    "use strick";

    Ext.define( 'Iterator', {

        statics : {
            curIdx : 0,
            preDom : null,
            /**
             * [queue 迭代队列，为防止错误产生，只能自己维护一个队列]
             * @type {Array}
             */
            queue  : [],

            Util   : require( '../util/Util' )
        },

        constructor : function(){
            var sttc = this.self;
            sttc.Util.listen( this, 'iteratorComplete', this.__iteratorComplete );
        },

        /**
         * [itrtrView 迭代实例化配置文件信息]
         * @param  {[type]} cfg [配置文件信息]
         * @return {void}
         */
        itrtrView : function( cfg ){
            var sttc  = this.self,
                queue = sttc.queue; 
            queue[ queue.length - 1 ][ 'cfg' ] = cfg;
            if( queue.length == 1 )
                this.__doItrtr( cfg );
        },

        /**
         * [setPreDom 设置当前配置文件的父节点ID，注意，ID中不能有井号，会被替换成空]
         * @param {[type]} id [父节点ID]
         */
        setPreDom : function( id ){
            var sttc     = this.self,
                queue    = sttc.queue,
                selector = id.replace( '#', '' );
            queue.push({
                'preDom' : selector
            });
            if( queue.length == 1 )
                this.__doSetPreDom( selector );
        },

        __doSetPreDom : function( selector ){
            this.self.preDom = document.getElementById( selector );
        },

        /**
         * [__doItrtr 迭代器]
         * @param   {Object} tCfg [配置信息]
         * @param   {Dom}    dom  [Dom对象，如果不填，会自动进行搜寻]
         * @return  {Void}
         * @protected
         */
        __doItrtr : function( tCfg, dom ){
            var sttc   = this.self,
                module, cls, id, html, instance, preDom, cfg;
            for( var i = 0; i < tCfg.length; i++ ){
                cfg    = tCfg[ i ];
                module = cfg[ 'class' ];
                cls    = '';
                id     = 'ios-' + sttc.curIdx;
                for( var j = 0; j < ( cfg.clsList || [] ).length; j++ ){
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
                if( cfg.index == 0 || cfg.index ){   
                    new window.iOS.Icon( cfg );
                } else {
                    new module( cfg );
                }
                
                sttc.curIdx++;
                if( cfg.subView && cfg.subView.length ){
                    this.__doItrtr( cfg.subView, html );
                }
            }
            sttc.Util.notify( this, 'iteratorComplete' );
        },

        /**
         * [__iteratorComplete 每次迭代完之后会被调用，用以检测队列中是否还有未进行迭代的项目]
         * @return {}
         */
        __iteratorComplete : function(){
            var sttc  = this.self,
                queue = sttc.queue; 
            queue.shift();
            if( !queue.length )
                return;
            this.__doSetPreDom( queue[ 0 ][ 'preDom' ] );
            this.__doItrtr( queue[ 0 ][ 'cfg' ] );
        }

    });
    
    var iterator = new Iterator();
    return iterator;
});