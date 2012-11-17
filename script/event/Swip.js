
define( function( require, exports, model ){
    "use strick";

    require( './BaseEvent' );
    Ext.define( "Swip", {
        extend : BaseEvent,

        _swip : function(){},

        _touchInfo : {
            startPos : {
                x : null,
                y
            }
        },

        touchStart : function( event ){

        },

        touchMove : function( event ){

        },

        touchStop : function( event ){

        }
    });
});