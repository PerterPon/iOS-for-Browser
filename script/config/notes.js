﻿
define( function( require, exports, modules ) {
    "use strict";

    var NotesIndex    = require( '../apps/notes/NotesIndex' ),
        CardView      = require( '../component/cardView/CardView' ),
        SigCard       = require( '../component/cardView/SigCard' ),
        NotesBar      = require( '../component/topBar/notesBar' ),
        NotesList     = require( '../apps/notes/M/NotesList' ),
        NotesContent  = require( '../apps/notes/M/NotesContent' ),
        NotesEdit     = require( '../apps/notes/M/NotesEdit' ),
        CNotesList    = require( '../apps/notes/C/CNotesList' ),
        CNotesContent = require( '../apps/notes/C/CNotesContent' ),
        CNotesEdit    = require( '../apps/notes/C/CNotesEdit' ),
        VNotesList    = require( '../apps/notes/V/VNotesList' ),
        VNotesContent = require( '../apps/notes/V/VNotesContent' ),
        VNotesEdit    = require( '../apps/notes/V/VNotesEdit' );
    return [ {
        "class"   : NotesIndex,
        "clsList" : [ "iOS_notes" ],
        "name"    : [ "appNotes" ],
        "subView" : [ {
            "class"   : CardView,
            "clsList" : [ "iOS_notes_cardView", "iOS_cardView" ],
            "name"    : "notesCardView",
            "subView" : [ {
                "class"   : SigCard,
                "clsList" : [ "iOS_notes_listCard" ],
                "name"    : "notesListCard",
                "default" : true,
                "cards"   : {
                    "rightBtn" : {
                        "cardName"  : "notesEditCard",
                        "direction" : "top"
                    },
                    "list"     : {
                       "cardName"   : "notesContentCard"
                    }
                },
                "subView" : [ {
                    "class"      : NotesBar,
                    "clsList"    : [ "iOS_notes_listBar", "iOS_notes_topBar" ],
                    "name"       : "notesListBar",                    
                    "btns"       : [ {
                        "text"      : "+",
                        "type"      : "round",
                        "direction" : "right",
                        "fontSize"  : "20"
                    } ]
                }, {
                    "class"      : NotesList,
                    "clsList"    : [ "iOS_notes_notesList" ],
                    "name"       : "notesList",
                    "needData"   : true,
                    "view"       : VNotesList,
                    "controller" : CNotesList
                } ]
            }, {
                "class"    : SigCard,
                "visiable" : false,
                "clsList"  : [ "iOS_notes_contentCard" ],
                "name"     : "notesContentCard",
                "cards"    : {
                    "leftBtn"  : { 
                        "cardName"  : "notesListCard" 
                    },
                    "rightBtn" : {
                        "cardName"  : "notesEditCard",
                        "direction" : "top"
                    }
                },
                "subView"  : [ {
                    "class"      : NotesBar,
                    "clsList"    : [ "iOS_notes_contentBar", "iOS_notes_topBar" ],
                    "name"       : "notesContentBar",
                    "opacity"    : "0",
                    "btns"       : [ {
                        "text"      : "备忘录",
                        "type"      : "arrow",
                        "direction" : "left"
                    }, {
                        "text"      : "test测试",
                        "type"      : "title",
                        "direction" : "center"
                    }, {
                        "text"      : "+",
                        "type"      : "round",
                        "direction" : "right",
                        "fontSize"  : "20"
                    } ]
                }, {
                    "class"      : NotesContent,
                    "clsList"    : [ "iOS_notes_notesContent" ],
                    "name"       : "notesList",
                    "view"       : VNotesContent,
                    "controller" : CNotesContent
                } ]
            }, {
                "class"   : SigCard,
                "visiable": false,
                "clsList" : [ "iOS_notes_editCard" ],
                "name"    : "notesEditCard",
                "cards"   : {
                    "rightBtn"   : {
                        "cardName"  : "notesEditCard",
                        "direction" : "bottom"
                    }
                },
                "subView" : [ {
                    "class"      : NotesBar,
                    "clsList"    : [ "iOS_notes_editBar", "iOS_notes_topBar" ],
                    "name"       : "notesEditBar",
                    "btns"       : [ {
                        "text"      : "",
                        "type"      : "title",
                        "direction" : "center"
                    }, {
                        "text"      : "完成",
                        "type"      : "round",
                        "direction" : "right"
                    } ]
                }, {
                    "class"      : NotesEdit,
                    "clsList"    : [ "iOS_notes_notesEdit" ],
                    "name"       : "notesEdit",
                    "view"       : VNotesEdit,
                    "controller" : CNotesEdit
                } ]
            } ]
        } ]
    } ]
    
} );