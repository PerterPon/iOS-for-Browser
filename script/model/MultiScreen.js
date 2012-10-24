
define( function( require, exports, module ){
    "use strick";

    require( './BaseModel' );
    Ext.define( 'Content', {
        extend : 'BaseModel',

        _handleChildCfg : function(){
            var sttc     = this.self,
                data     = sttc._data.data,
                AppIcon  = require( './AppIcon' ),
                CAppIcon = require( '../controller/CAppIcon' ),
                VAppIcon = require( '../view/VAppIcon' ),
                newCfg   = [];
            for( var i  = 0; i < data.length; i++ ){
                newCfg.push({
                    "class"    : AppIcon,
                    "_name"    : "appIcon_" + i,
                    "clsList"  : [ "iOS_iconScreen_appIcon", "iOS_iconScreen_appIcon_" + i ],
                    "controller"  : CAppIcon,
                    "view"     : VAppIcon,
                    "multiScreen" : i == 0 ? false : true,
                    "renderChild" : true,
                    "_data"    : {
                        "data" : data[ i ]
                    }
                });
            }
            sttc._data.data = newCfg;
        }
    });

    return Content;
});