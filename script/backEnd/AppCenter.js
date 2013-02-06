
/**
 * AppCenter    [用于App之间消息通知以及事件分发，或者返回App类]
 */
define( function( require, exports, modules ) {
    // "use strict";
    Ext.define( "AppCenter", {

        _appPool : {},

        /**
         * [addApp 所有app在第一次实例化的时候都会注册到appCenter,所有app须实现getDomObject方法，用于第二次打开时无需重复渲染]
         * @param {[String]} name [app的名称]
         * @param {[Object]} app  [app的实例]
         */
        addApp : function( name, app ) {
            _appPool[ name ] = app;
        }

    } );

    var center = new AppCenter();
    window.iOS.AppCenter = center;
    return AppCenter;
} );