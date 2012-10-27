
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'Content', {
        extend : 'BaseModel',

        _handleChildCfg : function(){
            var sttc     = this.values,
                data     = sttc.data.data,
                AppIcon  = require( './AppIcon' ),
                CAppIcon = require( '../controller/CLockScreen' ),
                VAppIcon = require( '../view/VAppIcon' ),
                newCfg   = [];
            for( var i  = 0; i < data.length; i++ ){
                newCfg.push({
                    "class"    : AppIcon,
                    "name"    : "appIcon_" + i,
                    "clsList"  : [ "iOS_iconScreen_appIcon", "iOS_iconScreen_appIcon_" + i, i == false ? "iOS_iconScreen_current" : "" ],
                    "controller"  : CAppIcon,
                    "view"     : VAppIcon,
                    "renderChild" : true,
                    "index"    : i,
                    "data"    : {
                        "data" : data[ i ]
                    }
                });
            }
            sttc.data.data = newCfg;
        }
    });

    return Content;
});