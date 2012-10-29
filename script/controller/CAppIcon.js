
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CAppIcon', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'translate' ]
            ]
        },

        Etranslate : function( x, y, isOri ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                view  = sttc.view;
            Util.notify( view, 'translate', [ x, y, isOri ]);
        }

    });

    return CAppIcon;
});