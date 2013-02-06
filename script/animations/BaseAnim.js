
define( function( require, exports, module ){
    //"use strict";

    Ext.define( "BaseAnim", {

        _cur : null,

        _tar : null,

        _width : null,

        _height : null,

        _curFrom : {},

        _tarFrom : {},

        _curTo : {},

        _tarTo : {},

        /**
         * [_animTime 默认的动画执行时间]
         * @type {Number}
         */
        _animTime : 400,

        /**
         * [_timeingFunction 动画执行类别]
         * @type {}
         */
        _timingFunction : null,

        _curCallBack : function() {},

        _tarCallBack : function() {},

        constructor : function( cfg ) {
            for( var i in cfg ) {
                this[ '_' + i ] = cfg[ i ];
            }
        },

        _calFromTo : function( animType ) {
        },

        _slide : function( direction ) {
            var curFrom = {
            }, tarFrom = {
            }, curTo = {
                webkitTransitionDuration : this._animTime,
                webkitTransitionTimingFunction : this._timingFunction
            }, tarTo = {
                webkitTransitionDuration : this._animTime,
                webkitTransitionTimingFunction : this._timingFunction
            }, that = this;
            if( 'left' === direction ) {
                tarFrom[ 'webkitTransform' ] = 'translate3d('+ this._width +'px, 0, 0)';
                curTo[ 'webkitTransform' ]   = 'translate3d(-'+ this._width +'px, 0, 0)';
                tarTo[ 'webkitTransform' ]   = 'translate3d(0, 0, 0)';
            } else if( 'right' === direction ) {
                tarFrom[ 'webkitTransform' ] = 'translate3d(-'+ this._width +'px, 0, 0)';
                curTo[ 'webkitTransform' ]   = 'translate3d('+ this._width +'px, 0, 0)';
                tarTo[ 'webkitTransform' ]   = 'translate3d(0, 0, 0)';                
            } else if( 'top' === direction ) {

            } else if( 'bottom' === direction ) {

            };
            this._curFrom = curFrom;
            this._tarFrom = tarFrom;
            this._curTo   = curTo;
            this._tarTo   = tarTo;
        },

        _reveal : function( direction ) {
            var tarFrom = {
                webkitTransform : 'translate3d(0,0,0)'
            }, curFrom  = {
            }, tarTo    = {
                webkitTransitionDuration : this._animTime,
                webkitTransitionTimingFunction : this._timingFunction
            }, curTo    = {
                webkitTransitionDuration : this._animTime,
                webkitTransitionTimingFunction : this._timingFunction
            };
            if( 'top' === direction ) {
                curTo[ 'webkitTransform' ] = 'translate3d(0, -'+ this._height +'px, 0)';
            } else if( 'bottom' === direction ) {
                curTo[ 'webkitTransform' ] = 'translate3d(0, '+ this._height +'px, 0)';
            } else if( 'left' === direction ) {
                curTo[ 'webkitTransform' ] = 'translate3d(-'+ this._width +'px, 0, 0)';
            } else if( 'right' === direction ) {
                curTo[ 'webkitTransform' ] = 'translate3d('+ this._width +'px, 0, 0)';
            };
            this._curFrom = curFrom;
            this._tarFrom = tarFrom;
            this._curTo   = curTo;
            this._tarTo   = tarTo;
        },

        _cover : function( direction ) {
            var tarFrom = {

            }, curFrom = {

            }, tarTo = {

            }, curTo = {

            };
            if( 'top' === direction ) {
                tarFrom[ 'webkitTransform' ] = 'translate3d(0, '+ this._height +'px, 0)';
            } else if( 'bottom' === direction ) {
                tarFrom[ 'webkitTransform' ] = 'translate3d(0, -'+ this._height +'px, 0)';
            } else if( 'right' === direction ) {
                tarFrom[ 'webkitTransform' ] = 'translate3d(-'+ this._width +'px, 0, 0)';
            } else if( 'left' === direction ) {
                tarFrom[ 'webkitTransform' ] = 'translate3d('+ this._width +'px, 0, 0)';
            }
            tarTo[ 'webkitTransform' ]   = 'translate3d(0, 0, 0)';
            this._curFrom = curFrom;
            this._tarFrom = tarFrom;
            this._curTo   = curTo;
            this._tarTo   = tarTo;
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
         * @param  {[DOM Object]} tar         [需要被显示card]
         * @param  {[String]} direction       [动画方向，各种类型动画有自己的实现，direction表示目标card运行的方向。]
         * @param  {[String]} animType        [动画类型，，默认slide]
         * @param  {[Function]} curCallBack   [当前card动画效果结束时的回调函数]
         * @param  {[Function]} tarCallBack   [目标card动画效果结束是的回调函数]
         * @return {[void]}
         */
        doAnim : function( cur, tar, direction, animType, curCallBack, tarCallBack ) {
            curCallBack && ( this._curCallBack = curCallBack );
            tarCallBack && ( this._tarCallBack = tarCallBack );
            this._cur = cur.extend ? cur[ 0 ] : cur;
            this._tar = tar.extend ? tar[ 0 ] : tar;
            this._cur.addEventListener( 'webkitTransitionEnd', function( event ) {
                event.stopPropagation();
                that._curCallBack();
                this.removeEventListener( 'webkitTransitionEnd', arguments.callee );
            } );
            this._tar.addEventListener( 'webkitTransitionEnd', function( event ) {
                event.stopPropagation();
                that._tarCallBack();
                this.removeEventListener( 'webkitTransitionEnd', arguments.callee );
            } );
            this._cur.style.webkitTransitionDuration = 0;
            this._cur.style.zIndex = 1;
            this._tar.style.webkitTransitionDuration = 0;
            this._tar.style.zIndex = 2;
            this[ '_' + animType.toLowerCase() ]( direction );
            $.extend( true, this._cur.style, this._curFrom );
            $.extend( true, this._cur.style, this._tarFrom );
            setTimeout( function() {
                $.extend( true, that._cur.style, this._curTo );
                $.extend( true, that._cur.style, this._tarTo );                
            }, 1 );
        }
    } );

    return BaseAnim;
} );