
define( function( require, exports, module ) {
    //"use strict";
    
    var iterator = require( './Iterator' ),
        cfg      = require( './config/global' );

    /**
     * [run 整个程序的入口函数，会在按下开机按钮，等所有文件被加载好时调用]
     * @return {void}
     */
    exports.run  = function() {
        initBackEnd();
        if( window.iOS.System.isWebkit ) {
            iterator.setPreDom( 'iOS_system_content' );
            iterator.itrtrView( cfg );
        } else {
            alert( 'Sorry, webkit only!' );
        }
        setTimeout( function() {
            removeBootLogo();
        }, 500 );
    }

    function initBackEnd() {
        if( window.iOS.BackEnd ) {
            return;
        }
        var BackEnd = require( './backEnd/BackEnd' ),
            backEnd = new BackEnd();
        window.iOS.BackEnd = backEnd;
    }

} );