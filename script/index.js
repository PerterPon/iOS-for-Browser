
define( function( require, exports, module ){
    "use strick";
    
    var iterator = require( './Iterator' ),
        cfg      = require( './config/global' );
    
    /**
     * [run 整个程序的入口函数，会在按下开机按钮，等所有文件被加载好时调用]
     * @return {void}
     */
    exports.run  = function(){
        iterator.setPreDom( 'iOS_system_content' );
        iterator.itrtrView( cfg );
        setTimeout( function(){
            removeBootLogo();
        }, 500 );
    }

});