
define( function( require, exports, module ) {
    "use strict";

    require( '../model/BaseModel' );
    Ext.define( 'BaseApp', {

        extend : 'BaseModel',

        /**
         * [getDomObject 返回此app的DOM节点]
         * @return {[DOM Object]}
         */
        getDomObject : function() {

        }

    } );

    return BaseApp;

} );