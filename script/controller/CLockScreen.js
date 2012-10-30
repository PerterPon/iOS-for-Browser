
define( function( require, exports, module ){
    "use strick";

    require( './BaseController' );
    Ext.define( 'CLockScreen', {
        extend : 'BaseController',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderMove' ],
                [ 'sliderUp' ],
                [ 'unlock' ],
                [ 'sliderTranslate' ],
                [ 'sliderBack' ],
                [ 'unlockComplete' ],
                [ 'updateTime' ]
            ]
        },

        EsliderDown : function( event ){
            var sttc  = this.values,
                sttcs = this.self,
                model   = sttc.model,
                Util    = sttcs.Util; 
            Util.notify( model, 'sliderDown', [ event ] ); 
        },

        EsliderMove : function( event ){
            var sttc  = this.values,
                sttcs = this.self,
                model   = sttc.model,
                Util    = sttcs.Util; 
            Util.notify( model, 'sliderMove', [ event ] );
        },

        EsliderUp : function( event ){
            var sttc  = this.values,
                sttcs = this.self,
                model   = sttc.model,
                Util    = sttcs.Util; 
            Util.notify( model, 'sliderUp', [ event ] );
        },

        Eunlock : function(){
            var sttc  = this.values,
                sttcs = this.self,
                view  = sttc.view,
                Util  = sttcs.Util; 
            Util.notify( view, 'unlock' );
        },

        EsliderTranslate : function( x, y ){
            var sttc  = this.values,
                sttcs = this.self,
                view  = sttc.view,
                Util  = sttcs.Util; 
            Util.notify( view, 'sliderTranslate', [ x, y ] );
        },

        EsliderBack : function(){
            var sttc  = this.values,
                sttcs = this.self,
                view  = sttc.view,
                Util  = sttcs.Util;
            Util.notify( view, 'sliderBack' );
        },

        EunlockComplete : function(){
            var sttc  = this.values,
                sttcs = this.self,
                model = sttc.model,
                Util  = sttcs.Util; 
            Util.notify( model, 'unlockComplete' );
        },

        EupdateTime : function( time ){
            var sttc  = this.values,
                sttcs = this.self,
                view  = sttc.view,
                Util  = sttcs.Util;
            Util.notify( view, 'updateTime', [ time ] );
        }

    });

    return CLockScreen;
});