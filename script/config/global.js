
define( function( require, exports, module ){
    "use strick";

    var BaseIOS     = require( '../model/BaseIOS' ),
        LockScreen  = require( '../model/LockScreen' ),
        IconScreen  = require( '../model/IconScreen' ),
        AppScreen   = require( '../model/AppScreen' ),
        PopScreen   = require( '../model/PopScreen' ),
        VIconScreen = require( '../view/VIconScreen' ),
        VLockScreen = require( '../view/VLockScreen' ),
        VAppScreen  = require( '../view/VAppScreen' ),
        VPopScreen  = require( '../view/VPopScreen' ),
        CLockScreen = require( '../controller/CLockScreen' ),
        CAppScreen  = require( '../controller/CAppScreen' ),
        CPopScreen  = require( '../controller/CPopScreen' ),
        CIconScreen = require( '../controller/CIconScreen' );
    return {
        "class"      : BaseIOS,
        "clsList"    : [ "iOS" ],
        "_name"      : "iOS",
        "view"       : "VIos",
        "controller" : "CIos",
        "subView"    : [{
            "class"      : LockScreen,
            "clsList"    : [ "iOS-lockScreen" ],
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