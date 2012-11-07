﻿
define( function( require, exports, module ){
    "use strick";

    var BaseIOS     = require( '../model/BaseIOS' ),
        TopBar      = require( '../model/TopBar' ),
        LockScreen  = require( '../model/LockScreen' ),
        IconScreen  = require( '../model/IconScreen' ),
        AppScreen   = require( '../model/AppScreen' ),
        PopScreen   = require( '../model/PopScreen' ),
        Home        = require( '../model/Home' ),
        AssistiveScreen = require( '../model/AssistiveScreen' ),
        VIOS        = require( '../view/VIOS' ),
        VTopBar     = require( '../view/VTopBar' ),
        VIconScreen = require( '../view/VIconScreen' ),
        VLockScreen = require( '../view/VLockScreen' ),
        VAppScreen  = require( '../view/VAppScreen' ),
        VPopScreen  = require( '../view/VPopScreen' ),
        VHome       = require( '../view/VHome' ),
        VAssistiveScreen = require( '../view/VAssistiveScreen' ),
        CTopBar     = require( '../controller/CTopBar' ),
        CLockScreen = require( '../controller/CLockScreen' ),
        CAppScreen  = require( '../controller/CAppScreen' ),
        CPopScreen  = require( '../controller/CPopScreen' ),
        CIconScreen = require( '../controller/CIconScreen' ),
        CHome       = require( '../controller/CHome' ),
        CAssistiveScreen = require( '../controller/CAssistiveScreen' );
    return [{
        "class"      : TopBar,
        "clsList"    : [ 'iOS_topBar' ],
        "name"       : "topBar",
        "view"       : VTopBar,
        "controller" : CTopBar,
        "height"     : '20px'
    }, {
        "class"      : BaseIOS,
        "clsList"    : [ "iOS" ],
        "name"       : "iOS",
        "view"       : VIOS,
        "flex"       : "460",
        "subView"    : [{
            "class"      : PopScreen,
            "clsList"    : [ "iOS_popScreen" ],
            "visiable"   : false,
            "name"       : "popScreen",
            "view"       : VPopScreen,
            "controller" : CPopScreen
        }, {
            "class"      : LockScreen,
            "clsList"    : [ "iOS_lockScreen" ],
            "name"       : "lockScreen",
            "view"       : VLockScreen,
            "controller" : CLockScreen
        }, {
            "class"      : IconScreen,
            "clsList"    : [ "iOS_iconScreen" ],
            "visiable"   : false,
            "name"       : "iconScreen",
            "view"       : VIconScreen,
            "controller" : CIconScreen,
            "needData"   : true,
            "renderChild": true
        }, {
            "class"      : AppScreen,
            "clsList"    : [ "iOS_appScreen" ],
            "name"       : "appScreen",
            "view"       : VAppScreen,
            "controller" : CAppScreen
        }]
    }, {
        "class"      : AssistiveScreen,
        "clsList"    : [ 'iOS_assistiveScreen' ],
        "name"       : "assistiveScreen",
        "visiable"   : false,
        "view"       : VAssistiveScreen,
        "controller" : CAssistiveScreen
    }];
});