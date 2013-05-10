
define( function( require, exports, module ){
    //"use strict";

    require( './BaseAnim' );
    Ext.define( "CardAnim", {
        extend   : 'BaseAnim',

        _tarFrom : {},

        _tarTo   : {},

        _tarCallBack : function() {},

        _slide : function( direction ) {
            this.callParent( arguments );
            var tarFrom = {
                webkitTransitionDuration : this._animTime,
                webkitTransitionTimingFunction : this._timingFunction
            }, tarTo = {
            }, that = this;
            if( 'left' === direction ) {
                tarFrom[ 'webkitTransform' ] = 'translate3d('+ this._width +'px, 0, 0)';
                tarTo[ 'webkitTransform' ]   = 'translate3d(0, 0, 0)';
            } else if( 'right' === direction ) {
                tarFrom[ 'webkitTransform' ] = 'translate3d(-'+ this._width +'px, 0, 0)';
                tarTo[ 'webkitTransform' ]   = 'translate3d(0, 0, 0)'; 
            } else if( 'top' === direction ) {
                this._curTo[ 'webkitTransform' ]   = 'translate3d(0, 0, 0)';
                tarFrom[ 'webkitTransform' ] = 'translate3d(0,'+ this._height +'px, 0)';
                tarTo[ 'webkitTransform' ]   = 'translate3d(0, 0, 0)';
            } else if( 'bottom' === direction ) {
                tarFrom[ 'webkitTransform' ] = 'translate3d(0, 0, 0)';
                tarTo[ 'webkitTransform' ]   = 'translate3d(0, 0, 0)';
            }
            this._tarFrom = tarFrom;
            this._tarTo   = tarTo;
        },

        _reveal : function( direction ) {
            this.callParent( arguments );
            var curFrom  = {
                }, tarTo = {
                    webkitTransitionDuration : this._animTime,
                    webkitTransitionTimingFunction : this._timingFunction
                };
            if( 'top' === direction ) {
                tarTo[ 'webkitTransform' ] = 'translate3d(0, -'+ this._height +'px, 0)';
            } else if( 'bottom' === direction ) {
                tarTo[ 'webkitTransform' ] = 'translate3d(0, '+ this._height +'px, 0)';
            } else if( 'left' === direction ) {
                tarTo[ 'webkitTransform' ] = 'translate3d(-'+ this._width +'px, 0, 0)';
            } else if( 'right' === direction ) {
                tarTo[ 'webkitTransform' ] = 'translate3d('+ this._width +'px, 0, 0)';
            };
            this._tarFrom = tarFrom;
            this._tarTo   = tarTo;
        },

        _cover : function( direction ) {
        },

        _swip : function( direction ) {
        },

        _fade : function( direction ) {
        },

        _pop : function( direction ) {
        },

        /**
         * [doAnim 执行动画操作]
         * @param  {[DOM Object]} cur         [当前显示card]
         * @param  {[String]} direction       [动画方向，各种类型动画有自己的实现，direction表示目标card运行的方向。]
         * @param  {[String]} animType        [动画类型，，默认slide]
         * @param  {[Function]} curCallBack   [当前card动画效果结束时的回调函数]
         * @return {[void]}
         */
        doAnim : function( cur, tar, direction, animType, curCallBack, tarCallBack, callBack ) {
            var that       = this,
                callBacked = false;
            curCallBack && ( this._curCallBack = curCallBack );
            tarCallBack && ( this._tarCallBack = tarCallBack );
            this._cur = cur.extend ? cur[ 0 ] : cur;
            this._tar = tar.extend ? tar[ 0 ] : tar;
            this._cur.addEventListener( 'webkitTransitionEnd', function( event ) {
                event.stopPropagation();
                this.style.display = 'none';
                that._curCallBack( 'hide' );
                transitionEnd();
                this.removeEventListener( 'webkitTransitionEnd', arguments.callee );
            } );
            this._tar.addEventListener( 'webkitTransitionEnd', function( event ) {
                event.stopPropagation();
                that._tarCallBack( 'show' );
                transitionEnd();
                this.removeEventListener( 'webkitTransitionEnd', arguments.callee );
            } );
            this._cur.style.webkitTransitionDuration = 0;
            this._cur.style.zIndex = 1;
            this._tar.style.webkitTransitionDuration = 0;
            this._tar.style.zIndex = 1;
            this[ '_' + animType.toLowerCase() ]( direction );
            $.extend( true, this._cur.style, this._curFrom );
            $.extend( true, this._tar.style, this._tarFrom );
            this._tar.style.display = '-webkit-box';
            this._tar.style.webkitTransitionDelay = this._animDelay;
            this._cur.style.webkitTransitionDelay = this._animDelay;
            setTimeout( function() {
                $.extend( true, that._cur.style, that._curTo );
                $.extend( true, that._tar.style, that._tarTo );                
            }, 1 );
            function transitionEnd() {
                callBacked = !callBacked && callBack && callBack();
            }
        }

    } );

    return CardAnim;
} );