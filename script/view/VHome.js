
define( function( require, exports, module ){
    //"use strict";

    require( './BaseView' );
    Ext.define( 'VHome', {
        extend : 'BaseView',

        _attachDomEvent : function(){
            //FIXME
            var homeBtn = document.getElementById( 'iOS_homeButton' ),
                sttc    = this.values,
                sttcs   = this.self,
                that    = this;
            $( function(){
                // $( '#iOS_homeButton' ).live( 'click', function(){
                //     sttcs.Util.notify( sttc.controller, 'homeButtonClick' );
                // });
                that._getEl().on( 'click', '#iOS_homeButton', function() {
                    sttcs.Util.notify( sttc.controller, 'homeButtonClick' ); 
                } );
            });
            
        }

    });

    return VHome;
});