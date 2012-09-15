
define( function( require, exports, module ){
    "use strict";

    var height, width, divece;
    
    function checkBroswer(){
        var diviceTest = {
            ipad       : sUserAgent.match(/ipad/i) == "ipad",   
            iphone     : sUserAgent.match(/iphone os/i) == "iphone os",    
            midp       : sUserAgent.match(/midp/i) == "midp",  
            ucweb      : sUserAgent.match(/ucweb/i) == "ucweb",
            android    : sUserAgent.match(/android/i) == "android",    
            windowsCe  : sUserAgent.match(/windows ce/i) == "windows ce",    
            windowsMobile : sUserAgent.match(/windows mobile/i) == "windows mobile"
        };
        for( var i in diviceTest ){
            if( diviceTest[ i ] ){
                divice = i;
                break;
            }
        }
    }

    function checkSize(){
        $( function(){
            var iOS = $( '#iOS' );
            height  = iOS.height();
            width   = iOS.width();
        });
    }

    checkBroswer();
    checkSize();

    return {
        width  : width,
        height : height,
        divice : divice 
    };
});