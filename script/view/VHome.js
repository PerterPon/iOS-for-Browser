
define( function( require, exports, module ){
    "use strick";

    require( './BaseView' );
    Ext.define( 'VHome', {
        extend : 'BaseView',

        _attachDomEvent : function(){
            //FIXME
            var homeBtn = document.getElementById( 'iOS_homeButton' ),
                sttc    = this.values,
                sttcs   = this.self;
            $( function(){
                $( '#iOS_homeButton, .iOS_assistive_home' ).live( 'click', function(){
                    sttcs.Util.notify( sttc.controller, 'homeButtonClick' );
                });
            });
            
        }

    });

    return VHome;
});