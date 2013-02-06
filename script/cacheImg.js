
define( function( require ) {
    //"use strict";

    var imgs = {
        system : './resource/images/background/background.jpg',
        topBar : {
            ATT     : './resource/images/status/ATT.png',
            battery : './resource/images/status/battery.png',
            lock    : './resource/images/status/lock.png',
            signal  : './resource/images/status/signal.png',
            wifi    : './resource/images/status/WiFi.png'
        },
        lockStuff : {
            lockTop    : './resource/images/lockStuff/lockTop.png',
            sliderContainer: './resource/images/lockStuff/lockBottom.png',
            slider     : './resource/images/lockStuff/lockSlider.png',
            sliderText : './resource/images/lockStuff/slideToUnlock.gif'
        },
        icons : {
            appstore   : './resource/images/icons/icon_appstore.png',
            calculator : './resource/images/icons/icon_calculator.png',
            calendar   : './resource/images/icons/icon_calendar.png',
            camera     : './resource/images/icons/icon_camera.png',
            clock      : './resource/images/icons/icon_clock.png',
            ipod       : './resource/images/icons/icon_ipod.png',
            itunes     : './resource/images/icons/icon_itunes.png',
            mail       : './resource/images/icons/icon_mail.png',
            map        : './resource/images/icons/icon_map.png',
            notes      : './resource/images/icons/icon_notes.png',
            phone      : './resource/images/icons/icon_phone.png',
            photo      : './resource/images/icons/icon_photo.png',
            safari     : './resource/images/icons/icon_safari.png',
            setting    : './resource/images/icons/icon_setting.png',
            SMS        : './resource/images/icons/icon_SMS.png',
            stocks     : './resource/images/icons/icon_stocks.png',
            weather    : './resource/images/icons/icon_weather.png',
            youtube    : './resource/images/icons/icon_youtube.png',
        },
        assistive : {
            home       : './resource/images/assistive/home.png',
            icon       : './resource/images/assistive/icon.png',
            device     : './resource/images/assistive/device.png',
            gesture    : './resource/images/assistive/gestures.png',
            favorites  : './resource/images/assistive/favorites.png'
        }
    };

    ( function cacheImg( info ) {
        var img, subInfo;
        for( var i in info ) {
            subInfo = info[ i ];
            if( typeof subInfo != 'string' ) {
                cacheImg( subInfo );
            } else {
                img     = new Image();
                img.src = info[ i ];
                img.onload = function() {
                    img = null;
                    delete img;
                }
            }
        }
    } )( imgs );
} );