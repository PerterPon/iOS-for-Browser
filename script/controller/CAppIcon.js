
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CAppIcon', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'translate' ],
                [ 'autoTranslate' ]
            ]
        },

        Etranslate : function( x, y ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                view  = sttc.view;
            Util.notify( view, 'translate', [ x, y ]);
        },

        EautoTranslate : function( tarPos, animTime ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                view  = sttc.view;
            Util.notify( view, 'autoTranslate', [ tarPos, animTime ] );
        }

    });

    return CAppIcon;
});