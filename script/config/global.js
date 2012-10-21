
define( function( require, exports, module ){
    "use strick";

    var BaseIOS     = require( '../model/BaseIOS' ),
        TopBar      = require( '../model/TopBar' ),
        LockScreen  = require( '../model/LockScreen' ),
        IconScreen  = require( '../model/IconScreen' ),
        AppScreen   = require( '../model/AppScreen' ),
        PopScreen   = require( '../model/PopScreen' ),
        VIOS        = require( '../view/VIOS' ),
        VTopBar     = require( '../view/VTopBar' ),
        VIconScreen = require( '../view/VIconScreen' ),
        VLockScreen = require( '../view/VLockScreen' ),
        VAppScreen  = require( '../view/VAppScreen' ),
        VPopScreen  = require( '../view/VPopScreen' ),
        CTopBar     = require( '../controller/CTopBar' ),
        CLockScreen = require( '../controller/CLockScreen' ),
        CAppScreen  = require( '../controller/CAppScreen' ),
        CPopScreen  = require( '../controller/CPopScreen' ),
        CIconScreen = require( '../controller/CIconScreen' );
    return [{
        "class"      : TopBar,
        "clsList"    : [ 'iOS_topBar' ],
        "_name"      : "topBar",
        "view"       : VTopBar,
        "controller" : CTopBar,
        "height"     : '20px'
    }, {
        "class"      : BaseIOS,
        "clsList"    : [ "iOS" ],
        "_name"      : "iOS",
        "view"       : VIOS,
        "flex"       : "460",
        "subView"    : [{
            "class"      : LockScreen,
            "clsList"    : [ "iOS_lockScreen" ],
            "_name"      : "lockScreen",
            "view"       : VLockScreen,
            "controller" : CLockScreen
        }, {
            "class"      : IconScreen,
            "clsList"    : [ "iOS_iconScreen" ],
            "visiable"   : false,
            "_name"      : "iconScreen",
            "view"       : VIconScreen,
            "controller" : CIconScreen,
            "needData"   : true,
            "renderChild": true
        }, {
            "class"      : AppScreen,
            "clsList"    : [ "iOS_appScreen" ],
            "visiable"   : false,
            "_name"      : "appScreen",
            "view"       : VAppScreen,
            "controller" : CAppScreen
        }, {
            "class"      : PopScreen,
            "clsList"    : [ "iOS_popScreen" ],
            "visiable"   : false,
            "_name"      : "popScreen",
            "view"       : VPopScreen,
            "controller" : CPopScreen
        }]
    }];
});