
define( function( require, exports, model ){
    "use strick";

    Ext.define( 'Animations', {

        /**
         * [animTime 运动效果持续时间]
         * @type {Number}
         */
        animTime : 250,
        /**
         * [easing 动画运行效果]
         * @type {String}
         */
        easing : 'ease-in-out',
        /**
         * [delay 动画效果开始时候的延迟]
         * @type {Number}
         */
        delay : 100,

        constructor : function( config ){

        },

        _init : function(){

        },

        _doAnim : function( currentEl, targetEl, from, to, type ){

        },

        /**
         * [_calculatePositionBeforeAnim 计算card运动前的位置]
         * @param  {String} type      [动画类型]
         * @param  {String} direction [操作动向]
         * @return {Object}           [计算得到的数据]
         */
        _calculatePositionBeforeAnim : function( type, direction ){

        },

        _setPositionBeforeAnim : function( currentEl, targetEl, form ){

        },

        slider : function( currentEl, targetEl ){

        },

        pop : function( currentEl, targetEl ){

        },

        wipe : function( currentEl, targetEl ){

        },

        fade : function( currentEl, targetEl ){

        },

        flip : function( currentEl, targetEl ){

        },

        completeHandle : function(){

        }
    });

    return Animations;
});