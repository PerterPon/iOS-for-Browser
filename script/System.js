
define( function( require, exports, module ){
    "use strict";

    var height, width, divice,
        sUserAgent = window.navigator.userAgent;
    
    function checkBroswer(){
        var diviceTest = {
            ipad       : sUserAgent.indexOf( 'ipad' ),   
            iphone     : sUserAgent.indexOf( 'iphone os' ),    
            midp       : sUserAgent.indexOf( 'midp os' ),  
            ucweb      : sUserAgent.indexOf( 'ucweb' ),
            android    : sUserAgent.indexOf( 'android' ),    
            windowsCe  : sUserAgent.indexOf( 'window ce' ),    
            windowsMobile : sUserAgent.indexOf( 'windows mobile' ),
            windowsDesktop: sUserAgent.indexOf( 'Windows NT' )
        };
        for( var i in diviceTest ){
            if( diviceTest[ i ] >= 0 ){
                divice = i;
                break;
            }
        }
    }

    function checkSize(){
        $( function(){
            var iOS = $( '#iOS_system_content' );
            iOS.length ? '' : iOS = $( 'body' );
            height  = iOS.height();
            width   = iOS.width();
        });
    }

    checkBroswer();
    checkSize();

    Ext.namespace( 'iOS.System' );
    window.iOS.System = {
        width  : width,
        height : height,
        divice : divice 
    };
});