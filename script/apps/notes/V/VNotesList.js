
define( function( require, exports, modules ) {
    "use strict";

    Ext.define( "VNotesList", {
        extend : 'BaseView',

        inheritableStatics : {
            eventList : [
                [ 'renderListData' ]
            ]
        },

        statics : {
            notesEdgeTop     : 'iOS_notes_edge_top',
            notesListContent : 'iOS_notes_list_content',
            notesEdgeBottom  : 'iOS_notes_edge_bottom'
        },

        ErenderListData : function( listDom ) {
            var sttcs = this.self;
            this._getElByCls( sttcs.notesListContent ).append( listDom );
        },

        _initInnerDom : function() {
            var sttcs = this.self,
                html = 
                "<div class='"+ sttcs.notesEdgeTop +"'>" +
                "</div>" +
                "<div class='"+ sttcs.notesListContent +"'>" + 
                "</div>" +
                "<div class='"+ sttcs.notesEdgeBottom +"'>" +
                "</div>";
            this._getEl().html( html );
        },

        
    } );

    return VNotesList;
} );