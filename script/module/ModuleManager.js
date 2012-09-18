
define( function( require, exports, module ){
    "use strict";

    require( '../BaseManager' );
    var Util = require( '../../util/Util' );
    Ext.define( 'ModuleManager', {
        extend : 'BaseManager',

        getModule : function( name ){
            return this.get( name );
        }

    });

    var moduleMgr = new ModuleManager( 'module' );

    return {
        register  : Util.bind( moduleMgr.register,  moduleMgr ),
        getModule : Util.bind( moduleMgr.getModule, moduleMgr )
    };

});