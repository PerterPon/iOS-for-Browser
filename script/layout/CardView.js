define( function( require, exports, model ){
    "use strick";

    require( '../Component' );
    var Animation = require( '../animation/Anim' );
    Ext.define( 'CardView', {
        extend : 'Component',

        values : {
            /**
             * [currentCard 当前显示的card的名称，默认为第一个card]
             * @type {String}
             */
            currentCard : null
        },

        /**
         * [_init 初始化cardView]
         * @return {}
         */
        _init : function(){

        },

        /**
         * [_getCardByName 根据card名称获取card对象]
         * @param  {String} cardName [card的名字]
         * @return {Object}          [获得到的card]
         */
        _getCardByName : function( cardName ){

        },

        /**
         * [active 激活某个card，对外接口]
         * @param  {String} cardName [需要激活的card的名字]
         * @return {void}
         */
        active : function( cardName ){

        },

        /**
         * [getCard 对外接口，根据card名称获得card对象]
         * @param  {String} cardName [需要获得的card的名称]
         * @return {Object}          [获得到的card]
         */
        getCard : function( cardName ){
            return this._getCardByName( cardName );
        },

        /**
         * [getCurrentCard 获得当前激活的card]
         * @return {Object} [获得到的card]
         */
        getCurrentCard : function(){
            return this._getCardByName( this.values.currentCard );
        }

    });

    return CardView;
});