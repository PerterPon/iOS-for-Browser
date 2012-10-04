
define( function( require ){
    "use strick";

    var imgs = {
        system : './resource/images/background/background.jpg',
        topBar : {
            ATT     : './resource/images/status/ATT.png',
            battery : './resource/images/status/battery.png',
            lock    : './resource/images/status/lock.png',
            signal  : './resource/images/status/signal.png',
            wifi    : './resource/images/status/wifi.png'
        }
    };

    cacheImg( imgs );
    function cacheImg( info ){
        var img, subInfo;
        for( var i in info ){
            subInfo = info[ i ];
            if( typeof subInfo != 'string' ){
                cacheImg( subInfo );
            } else {
                img     = new Image();
                img.src = info[ i ];     
            }
        }
    }
});