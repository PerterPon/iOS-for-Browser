
define( function( require, exports, module ) {
    //"use strict";

    var BaseIOS     = require( '../model/BaseIOS' ),
        TopBar      = require( '../model/TopBar' ),
        LockScreen  = require( '../model/LockScreen' ),
        IconScreen  = require( '../model/IconScreen' ),
        AppScreen   = require( '../model/AppScreen' ),
        PopScreen   = require( '../model/PopScreen' ),
        Home        = require( '../model/Home' ),
        AssistiveScreen = require( '../model/AssistiveScreen' ),
        MaskScreen  = require( '../model/MaskScreen' ),
        VIOS        = require( '../view/VIOS' ),
        VTopBar     = require( '../view/VTopBar' ),
        VIconScreen = require( '../view/VIconScreen' ),
        VLockScreen = require( '../view/VLockScreen' ),
        VAppScreen  = require( '../view/VAppScreen' ),
        VPopScreen  = require( '../view/VPopScreen' ),
        VHome       = require( '../view/VHome' ),
        VAssistiveScreen = require( '../view/VAssistiveScreen' ),
        VMaskScreen = require( '../view/VMaskScreen' ),
        CTopBar     = require( '../controller/CTopBar' ),
        CLockScreen = require( '../controller/CLockScreen' ),
        CAppScreen  = require( '../controller/CAppScreen' ),
        CPopScreen  = require( '../controller/CPopScreen' ),
        CIconScreen = require( '../controller/CIconScreen' ),
        CHome       = require( '../controller/CHome' ),
        CAssistiveScreen = require( '../controller/CAssistiveScreen' ),
        CMaskScreen = require( '../controller/CMaskScreen' );
    return [ {
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
        "subView"    : [ {
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
        }, {
            "class"      : MaskScreen,
            "clsList"    : [ 'iOS_maskScreen' ],
            "name"       : "maskView",
            "visiable"   : false,
            "view"       : VMaskScreen,
            "controller" : CMaskScreen
        } ]
    }, {
        "class"      : AssistiveScreen,
        "clsList"    : [ 'iOS_assistiveScreen' ],
        "name"       : "assistiveScreen",
        "visiable"   : true,
        "view"       : VAssistiveScreen,
        "controller" : CAssistiveScreen,
        "needData"   : true,
        "subView"    : [ {
            "class"  : Home,
            "name"   : 'home',
            "clsList": 'iOS_home',
            "controller" : CHome,
            "view"       : VHome
        } ]
    } ];
} );