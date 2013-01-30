//检查执行环境，包括移动设备和桌面设备。
$(function(){
    //"use strict";

    var height, width, divice,
        sUserAgent = ( window.navigator.userAgent ).toLowerCase();

    /**
     * [checkBroswer 检查浏览环境]
     * @return {void}
     */
    function checkBroswer(){
        var diviceTest = {
            ipad       : sUserAgent.indexOf( 'ipad' ),   
            iphone     : sUserAgent.indexOf( 'iphone os' ),    
            midp       : sUserAgent.indexOf( 'midp os' ),  
            ucweb      : sUserAgent.indexOf( 'ucweb' ),
            android    : sUserAgent.indexOf( 'android' ),    
            windowsCe  : sUserAgent.indexOf( 'window ce' ),    
            windowsMobile : sUserAgent.indexOf( 'windows mobile' ),
            windowsDesktop: sUserAgent.indexOf( 'windows nt' ),
            macDecktop    : sUserAgent.indexOf( 'mac' ),
            linuxDesktop  : sUserAgent.indexOf( 'linux' )
        };
        for( var i in diviceTest ){
            if( diviceTest[ i ] >= 0 ){
                divice = i;
                break;
            }
        }
    }

    /**
     * [initPhone 初始化移动设备上的环境]
     * @return {void}
     */
    function initPhone(){
        cancleBounce();
    }

    /**
     * [initDesktop 初始化桌面设备的环境]
     * @return {void}
     */
    function initDesktop(){
        var bg       = document.createElement( 'div' ),
            content  = document.createElement( 'div' );
        bg.id = 'iOS_outSide_bg';
        content.id = 'iOS_system_content';
        bg.appendChild( content );
        document.body.appendChild( bg );
    }

    /**
     * [checkSize 检查运行环境的宽和高]
     * @return {void}
     */
    function checkSize(){
        var iOS = $( '#iOS_system_content' );
        iOS.length ? '' : iOS = $( 'body' );
        height  = iOS.height();
        width   = iOS.width();
    }

    /**
     * [cancleBounce 取消iOS设备上的bounce效果]
     * @return {void}
     */
    function cancleBounce(){
        document.addEventListener( 'touchmove', function( event ){
            event.preventDefault();
        });
    }

    /**
     * [cacheBootLogo 缓存开机logo]
     * @return {void}
     */
    function cacheBootLogo(){
        var img = new Image();
        img.src = './resource/images/boot/bootLogo.png';
        img.onload = function(){
            img = undefined;
        }
    }

    checkBroswer();
    cacheBootLogo();

    if( divice.indexOf( 'Desktop' ) >= 0 ){
        initDesktop();
    } else {
        initPhone();
    }

    checkSize();
    window.iOS ? '' : window.iOS = {};
    window.iOS.System = {
        isWebkit : sUserAgent.indexOf( 'webkit' ) >= 0 ? true : false,
        width    : width,
        height   : height,
        divice   : divice 
    };
})