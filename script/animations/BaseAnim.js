
define( function( require, exports, module ){
    //"use strict";

    Ext.define( "BaseAnim", {

        _cur : null,

        _width : null,

        _height : null,

        _curFrom : {},

        _curTo : {},

        /**
         * [_animTime 默认的动画执行时间]
         * @type {Number}
         */
        _animTime : '400ms',

        /**
         * [_timeingFunction 动画执行类别]
         * @type {}
         */
        _timingFunction : 'easy-in-out',

        _animDelay : '150ms',

        _curCallBack : function() {},

        constructor : function( cfg ) {
            for( var i in cfg ) {
                this[ '_' + i ] = cfg[ i ];
            }
        },

        _slide : function( direction ) {
            var curFrom = {
                webkitTransitionDuration : this._animTime,
                webkitTransitionTimingFunction : this._timingFunction
            }, curTo = {
            }, that = this;
            if( 'left' === direction ) {
                curTo[ 'webkitTransform' ] = 'translate3d(-'+ this._width +'px, 0, 0)';
            } else if( 'right' === direction ) {
                curTo[ 'webkitTransform' ] = 'translate3d('+ this._width +'px, 0, 0)';
            } else if( 'top' === direction ) {
                curTo[ 'webkitTransform' ] = 'translate3d(0, -'+ this._height +'px, 0)';
            } else if( 'bottom' === direction ) {
                curTo[ 'webkitTransform' ] = 'translate3d(0, '+ this._height +'px, 0)';
            }
            this._curFrom = curFrom;
            this._curTo   = curTo;
        },

        _reveal : function( direction ) {
            var curFrom  = {
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
            this._curTo   = curTo;
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
        doAnim : function( cur, animType, direction, curCallBack, callBack ) {
            var that  = this;
            curCallBack && ( this._curCallBack = curCallBack );
            this._cur = cur.extend ? cur[ 0 ] : cur;
            this._cur.addEventListener( 'webkitTransitionEnd', function( event ) {
                event.stopPropagation();
                that._curCallBack();
                callBack && callBack();
                this.removeEventListener( 'webkitTransitionEnd', arguments.callee );
            } );
            this._cur.style.webkitTransitionDuration = 0;
            this._cur.style.zIndex = 1;
            this[ '_' + animType.toLowerCase() ]( direction );
            $.extend( true, this._cur.style, this._curFrom );
            this._cur.style.webkitTransitionDelay = this._animDelay;
            setTimeout( function() {
                $.extend( true, that._cur.style, that._curTo );
            }, 1 );
        }

    } );

    return BaseAnim;
} );