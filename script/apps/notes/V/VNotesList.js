
define( function( require, exports, modules ) {
    // "use strict";

    Ext.define( "VNotesList", {
        extend : 'BaseView',

        statics : {
            notesEdgeTop     : 'iOS_notes_edge_top',
            notesListContent : 'iOS_notes_list_content',
            notesEdgeBottom  : 'iOS_notes_edge_bottom'
        },

        _initInnerDom : function() {
            var sttcs = this.self,
                html = 
                "<div class='"+ sttcs.notesEdgeTop +"'>" +
                "</div>" +
                "<div class='"+ sttcs.notesListContent +"'>"  + 
                "</div>" +
                "<div class='"+ sttcs.notesEdgeBottom +"'>"  +
                "</div>"
            this._getEl().html( html );
        },

        _dataReady : function() {
            var sttc  = this.values,
                sttcs = this.self,
                List  = require( './component/list/NotesList' ),
                list;
            list      = new List();
            list.setData( sttc.data );
            this._getElCacheByCls( sttc.notesListContent ).html( list.getDom() );
        }
    } );

    return VNotesList;
} );