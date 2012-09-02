
define( function( require, exports, module ){
    "use strict";

    var height, width;
    
    function checkBroswer(){
        var bIsIpad     = sUserAgent.match(/ipad/i) == "ipad",   
            bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",    
            bIsMidp     = sUserAgent.match(/midp/i) == "midp",
            bIsUc7      = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",   
            bIsUc7      = sUserAgent.match(/ucweb/i) == "ucweb",
            bIsAndroid  = sUserAgent.match(/android/i) == "android",    
            bIsCE       = sUserAgent.match(/windows ce/i) == "windows ce",    
            bIsWM       = sUserAgent.match(/windows mobile/i) == "windows mobile";
    }
});