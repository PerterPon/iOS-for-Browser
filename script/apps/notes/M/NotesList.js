
define( function( require, exports, modules ) {
    "use strict";

    var List = require( '../../../component/list/NotesList' );
    Ext.define( "NotesList", {
        extend : "BaseModel",

        _dataReady : function() {
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                list;
            list      = new List();
            list.setData( sttc.data );
            Util.notify( sttc.controller, 'renderListData', [ list.getDom() ] );
        }
        
    } );

    return NotesList;
} );