
define( function( require, exports, module ){
    "use strick";

    var height, width, divice,
        sUserAgent = ( window.navigator.userAgent ).toLowerCase();
    
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
        var iOS = $( '#iOS_system_content' );
        iOS.length ? '' : iOS = $( 'body' );
        height  = iOS.height();
        width   = iOS.width();
    }

    function cancleBounce(){
        if( divice == 'iphone' || divice == 'ipad' ){
            document.addEventListener( 'touchmove', function( event ){
                event.preventDefault();
            });
        }
    }

    checkBroswer();
    checkSize();
    cancleBounce();

    Ext.namespace( 'iOS.System' );
    window.iOS.System = {
        isWebkit : sUserAgent.indexOf( 'webkit' ) >= 0 ? true : false,
        width    : width,
        height   : height,
        divice   : divice 
    };
});