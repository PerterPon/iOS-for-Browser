
define( function( require, exports, module ){
    "use strick";

    var BaseIOS     = require( '../model/BaseIOS' ),
        BootScreen  = require( '../model/BootScreen' ),
        LockScreen  = require( '../model/LockScreen' ),
        IconScreen  = require( '../model/IconScreen' ),
        AppScreen   = require( '../model/AppScreen' ),
        PopScreen   = require( '../model/PopScreen' ),
        VBootScreen = require( '../view/VBootScreen' ),
        VIconScreen = require( '../view/VIconScreen' ),
        VLockScreen = require( '../view/VLockScreen' ),
        VAppScreen  = require( '../view/VAppScreen' ),
        VPopScreen  = require( '../view/VPopScreen' ),
        CBootScreen = require( '../controller/CBootScreen' ),
        CLockScreen = require( '../controller/CLockScreen' ),
        CIconScreen = require( '../controller/CAppScreen' ),
        CPopScreen  = require( '../controller/CPopScreen' );
    return {
        "class"      : BaseIOS,
        "clsList"    : [ "iOS" ],
        "_name"      : "iOS",
        "view"       : "VIos",
        "controller" : "CIos",
        "subView"    : [{
            "class"      : BootScreen,
            "clsList"    : [ "iOS-bootScreen" ],
            "_name"      : "bootScreen",
            "view"       : VBootScreen,
            "controller" : CBootScreen
        }, {
            "class"      : LockScreen,
            "clsList"    : [ "iOS-lockScreen" ],
            "visiable"   : false,
            "_name"      : "lockScreen",
            "view"       : VLockScreen,
            "controller" : CLockScreen
        }, {
            "class"      : IconScreen,
            "clsList"    : [ "iOS-iconScreen" ],
            "visiable"   : false,
            "_name"      : "iconScreen",
            "view"       : VIconScreen,
            "controller" : CIconScreen
        }, {
            "class"      : AppScreen,
            "clsList"    : [ "iOS-appScreen" ],
            "visiable"   : false,
            "_name"      : "appScreen",
            "view"       : VAppScreen,
            "controller" : CAppScreen
        }, {
            "class"      : PopScreen,
            "clsList"    : [ "iOS-popScreen" ],
            "visiable"   : false,
            "_name"      : "popScreen",
            "view"       : VPopScreen,
            "controller" : CPopScreen
        }]
    };
});