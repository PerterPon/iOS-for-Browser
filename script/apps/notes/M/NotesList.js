
define( function( require, exports, modules ) {
    "use strict";

    var List     = require( '../../../component/list/NotesList' ),
        iterator = require( '../../../Iterator' );
    Ext.define( "NotesList", {
        extend : "BaseModel",

        statics : {
            listName : 'iOS_notes_list'
        },

        _getDefaultData : function() {
            return require( '../../../../resource/defaultData/notes/NotesList' );
        },

        _dataReady : function() {
            var sttc    = this.values,
                sttcs   = this.self,
                Util    = sttcs.Util,
                listCfg = [ {
                    listBoxCls : 'iOS_notes_listBox',
                    name       : sttcs.listName,
                    "class"    : List,
                    callBack   : Util.bind( renderList, this )
                } ];
            iterator.setPreDom( sttc.selector );
            iterator.itrtrView( listCfg );
            function renderList() {
                var manager = window.iOS.Manager.list,
                    list    = manager.get( sttcs.listName );
                list.setData( sttc.data );
                Util.notify( sttc.controller, 'renderListData', [ list.getDom() ] );
            }
        }
    } );

    return NotesList;
} );