
define( function( require ) {
    //"use strict";

    var CardView = require( './component/cardView/CardView' ),
        SigCard  = require( './component/cardView/SigCard' );

    Ext.define( 'Iterator', {

        statics : {
            Util   : require( '../util/Util' )
        },

        values : {
            curIdx : 0,
            preDom : null,
            /**
             * [queue 迭代队列，保证渲染顺序]
             * @type {Array}
             */
            queue  : [],
        },

        constructor : function() {
            var sttcs = this.self;
            sttcs.Util.listen( this, 'iteratorComplete', this.__iteratorComplete );
        },

        /**
         * [itrtrView 迭代实例化配置文件信息]
         * @param  {[Object]} cfg [配置文件信息]
         * @return {void}
         */
        itrtrView : function( cfg ) {
            var sttc  = this.values,
                queue = sttc.queue; 
            queue[ queue.length - 1 ][ 'cfg' ] = cfg;
            if( 1 === queue.length ) {
                this.__doItrtr( cfg );
            }
        },

        /**
         * [setPreDom 设置当前配置文件的父节点ID]
         * @param {[type]} id [父节点ID]
         */
        setPreDom : function( id ) {
            var sttc     = this.values,
                queue    = sttc.queue,
                selector = id.replace( '#', '' );
            queue.push( {
                'preDom' : selector
            } );
            if( 1 === queue.length ) {
                this.__doSetPreDom( selector );
            }
        },

        __doSetPreDom : function( selector ) {
            this.values.preDom = document.getElementById( selector );
        },

        /**
         * [__doItrtr 迭代器]
         * @param   {Object} tCfg [配置信息]
         * @param   {Dom}    dom  [Dom对象，如果不填，会自动进行搜寻]
         * @return  {Void}
         * @protected
         */
        __doItrtr : function( tCfg, dom, parentCardView, parentSigCard ) {
            var sttcs    = this.self,
                sttc     = this.values,
                model, cls, id, html, instance, preDom, cfg, cardView, sigCard, i, j;
            for( i = 0; i < tCfg.length; i++ ) {
                cfg      = tCfg[ i ];
                model    = cfg[ 'class' ];
                cls      = '';
                id       = 'ios-' + sttc.curIdx;
                for( j   = 0; j < ( cfg.clsList || [] ).length; j++ ) {
                    !cfg.clsList[ j ] || ( cls += cfg.clsList[ j ] + ' ' );
                }
                html     = document.createElement( 'div' );
                html.id  = id;
                html.className = cls;
                if( cfg.flex ) {
                    html.style[ '-webkit-box-flex' ] = cfg.flex;
                }
                if( cfg.height ) {
                    html.style[ 'height' ] = cfg.height;
                }
                if( cfg.width ) {
                    html.style[ 'width' ]  = cfg.width;
                }
                preDom = dom || sttc.preDom || document.body;
                preDom.appendChild( html );
                cfg[ 'selector' ] = '#' + id;
                instance = new model( cfg );
                model instanceof CardView ? cardView = instance : ( ( model instanceof SigCard ) && ( sigCard = instance ) );
                if( parentCardView ) {
                    parentCardView.addSigCard( cfg[ 'name' ], instance );
                    instance.cardView = parentCardView;
                } else if( parentSigCard ) {
                    parentSigCard.addItems( cfg[ 'name' ], instance );
                    instance.sigCard = parentSigCard;                    
                }
                // parent && ( instance._parent = parent );
                sttc.curIdx++;
                if( cfg.subView && cfg.subView.length ) {
                    this.__doItrtr( cfg.subView, html, cardView, sigCard );
                }
                cardView = null;
                sigCard  = null;
                cfg.callBack && cfg.callBack();
            }
            sttcs.Util.notify( this, 'iteratorComplete' );
        },

        /**
         * [__iteratorComplete 每次迭代完之后会被调用，用以检测队列中是否还有未进行迭代的项目]
         * @return {}
         */
        __iteratorComplete : function(){
            var sttc  = this.values,
                queue = sttc.queue; 
            queue.shift();
            if( !queue.length ) {
                return;
            }
            this.__doSetPreDom( queue[ 0 ][ 'preDom' ] );
            this.__doItrtr( queue[ 0 ][ 'cfg' ] );
        }

    });
    
    var iterator = new Iterator();
    return iterator;
});