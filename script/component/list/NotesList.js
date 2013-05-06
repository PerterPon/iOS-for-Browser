
define( function( require, exports, module ) {

    require( '../../component/list/List' );
    Ext.define( 'NotesList', {

        extend : 'List',

        inheritableStatics : {
            listItemSelectedCls : 'iOS_notes_listItem_selected'
        },

        statics : {
            sigCard : 'notesListCard'
        }
    } );

    return NotesList;
} );