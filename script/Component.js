//所有类的基类
define( function( require, exports, module ){
    "use strick";

    Ext.define( 'Component', {

        inheritableStatics : {},

        constructor : function( cfg ){
            this._applyCfg( cfg );
            this._registerSelf();
        },

        _applyCfg : function( cfg ){
            var sttc  = this.self;
            for( var i in cfg ){
                if( i = 'subView' )
                    continue;
                sttc[ i ] = cfg[ i ];    
            }
        },

        _registerSelf : function(){
            var sttc    = this.self,
                manager = sttc.manager;
            manager.register( sttc.name, this ); 
        }

    });

    return Component;
});