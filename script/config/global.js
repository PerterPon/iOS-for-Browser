
define( function( require, exports, module ){
    "use strick";

    var BaseIOS    = require( '../model/BaseIOS' ),
        BootScreen = require( '../model/BootScreen' ),
        LockScreen = require( '../model/LockScreen' ),
        IconScreen = require( '../model/IconScreen' ),
        AppScreen  = require( '../model/AppScreen' );
    return {
        "class"      : BaseIOS,
        "clsList"    : [ "iOS" ],
        "name"       : "iOS",
        "view"       : "VIos",
        "controller" : "CIos",
        "subView"    : [{
            "class"      : BootScreen,
            "clsList"    : [ "iOS-bootScreen" ],
            "visiable"   : "true",
            "name"       : "bootScreen",
            "view"       : "VBootScreen",
            "controller" : "CBootScreen"
        }, {
            "class"      : LockScreen,
            "clsList"    : [ "iOS-lockScreen" ],
            "visiable"   : "false",
            "name"       : "lockScreen",
            "view"       : "VLockScreen",
            "controller" : "CLockScreen"
        }, {
            "class"      : IconScreen,
            "clsList"    : [ "iOS-iconScreen" ],
            "visiable"   : "false",
            "name"       : "iconScreen",
            "view"       : "VIconScreen",
            "controller" : "CIconScreen"
        }, {
            "class"      : AppScreen,
            "clsList"    : [ "iOS-appScreen" ],
            "visiable"   : "false",
            "name"       : "appScreen",
            "view"       : "VAppScreen",
            "controller" : "CAppScreen"
        }]
    };
});