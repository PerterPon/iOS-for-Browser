
define( function( require, exports, module ){
    "use strick";

    var IOS = require( '../module/BaseIOS' );
    return {
        "class"      : IOS,
        "clsList"    : [ "iOS" ],
        "name"       : "iOS",
        "view"       : "VIos",
        "controller" : "CIos",
        "subView"    : [{
            "class"      : "BootScreen",
            "clsList"    : [ "iOS-bootScreen" ],
            "visiable"   : "true",
            "name"       : "bootScreen",
            "view"       : "VBootScreen",
            "controller" : "CBootScreen"
        }, {
            "class"      : "LockScreen",
            "clsList"    : [ "iOS-lockScreen" ],
            "visiable"   : "false",
            "name"       : "lockScreen",
            "view"       : "VLockScreen",
            "controller" : "CLockScreen"
        }, {
            "class"      : "IconScreen",
            "clsList"    : [ "iOS-iconScreen" ],
            "visiable"   : "false",
            "name"       : "iconScreen",
            "view"       : "VIconScreen",
            "controller" : "CIconScreen"
        }]
    };
});