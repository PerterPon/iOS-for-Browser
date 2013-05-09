
define( function( require, exports, modules ) {

    require( './BaseAnim' );
    Ext.define( 'Anim', {
        extend : 'BaseAnim',

        _filter : function() {
            var from = {
                webkitTransitionDuration : this._animTime,
                webkitTransitionTimingFunction : this._timeingFunction,
                webkitTransitionDelay    : this._animDelay
            }, to = {
                opacity : 0
            };
            this._curTo   = to;
            this._curFrom = from;
        },

        _unfilter : function() {
            var from = {
                webkitTransitionDuration : this._animTime,
                webkitTransitionTimingFunction : this._timeingFunction,
                webkitTransitionDelay    : this._animDelay
            }, to    = {
                opacity : 1
            };
            this._curFrom = from;
            this._curTo   = to;
        }

    } );

    window.iOS.Anim = new Anim( {
        width  : window.iOS.System.width,
        height : window.iOS.System.height
    } );

} );