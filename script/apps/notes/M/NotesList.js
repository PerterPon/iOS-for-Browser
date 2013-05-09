
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
            return require( '../../../../../../resource/defaultData/notes/NotesList' );
        },

        _dataReady : function() {
            var sttc    = this.values,
                sttcs   = this.self,
                Util    = sttcs.Util,
                listCfg = [ {
                    listBoxCls : 'notesList',
                    name       : sttcs.listName,
                    "class"    : List,
                    callBack   : Util.bind( renderList, this ),
                    clickedCallback : Util.bind( this._clickedCallBack, this )
                } ];
            iterator.setPreDom( sttc.selector );
            iterator.itrtrView( listCfg );
            function renderList() {
                var manager = window.iOS.Manager.list,
                    list    = manager.get( sttcs.listName );
                sttc.list   = list;
                list.setData( sttc.data );
                Util.notify( sttc.controller, 'renderListData', [ list.getDom() ] );
            }
        },

        _clickedCallBack : function( event, index ) {
            this.sigCard.changeCard( "list", {
                //FIXME:
                direction : "left",
                callBack  : sttcs.Util.bind( this._showOrHide, this )
            } );
        },

        _showOrHide : function( showOrHide ) {
            if( 'hide' === showOrHide ) {
                this.values.list.clearSelect();
            }
        },  

        __notifySigCard : function() {
            var direction = {
                "direction" : "right"
            };
            this.sigCard.changeCard( "list", direction );
        }
    } );

    return NotesList;
} );