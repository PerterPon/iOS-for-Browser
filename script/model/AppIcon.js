
define( function( require, exports, module ){
    "use strick";

    require( './IconContent' );
    Ext.define( 'AppIcon', {
        extend : 'IconContent',

        inheritableStatics : {
            eventList : [
                [ 'sliderDown' ],
                [ 'sliderUp' ],
                [ 'sliderMove' ]
            ]
        },

        statics : {
            width     : window.iOS.System.width,
            fullTime  : 600,
            swipeTime : 450
        },

        _attachEventListener : function(){
            this.callParent();
            var sttc  = this.values,
                Event = window.iOS.Event;
            Event.addEvent( 'unlock', this.__unlockHandler, this );
            Event.addEvent( 'multiScreenTranslate', this.__multiScreenTranslate, this );
            Event.addEvent( 'multiScreenAutoTranslate', this.__multiScreenAutoTranslate, this );
        },

        __unlockHandler : function(){
            var sttc  = this.values,
                sttcs = this.self,
                ctrl  = sttc.controller,
                Util  = sttcs.Util;
            Util.notify( ctrl, 'unlock' );
        },

        /**
         * [__multiScreenTranslate multiScreen运行时候的处理函数]
         * @param  {Number} curIdx    [当前运动屏幕的index值]
         * @param  {String} direction [运动的方向]
         * @param  {Number} distance  [运动的距离]
         * @return {void}
         */
        __multiScreenTranslate : function( curIdx, direction, distance ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller,
                dis   = direction == 'left' ? 1 : -1;
            if( curIdx == sttc.index ){
                Util.notify( ctrl, 'translate', [ distance, 0 ] );
            } else if( curIdx + dis == sttc.index ){
                distance += dis * sttcs.width;
                Util.notify( ctrl, 'translate', [ distance, 0 ] );
            }
        },

        /**
         * [__multiScreenAutoTranslate 鼠标或手指松开时候的事件处理函数，由此处理事件]
         * @param  {Boolean}  boundaryScreen [是否为边界屏幕]
         * @param  {String}   direction      [当前运动的方向]
         * @param  {Number}   distance       [当前已经运动的距离]
         * @param  {Boolean}  isSwip         [当前是否是swip事件]
         * @return {void}
         */
        __multiScreenAutoTranslate : function( curIdx, direction, distance, swipe ){
            var sttc  = this.values,
                sttcs = this.self,
                Util  = sttcs.Util,
                ctrl  = sttc.controller,
                moveBack = distance < sttcs.width / 2,
                posFix   = direction == 'left' ? -1 : 1, 
                tarPos, animTime;
            if( ( sttc.index != curIdx ) && ( sttc.index + posFix != curIdx ) )
                return;
            if( moveBack && !swipe ){
                animTime    = sttcs.fullTime * distance / sttcs.width;
                if( curIdx == sttc.index )
                    tarPos  = 0;
                else
                    tarPos  = sttcs.width * ( direction == 'left' ? 1 : -1 );
            } else {
                if( swipe )
                    animTime = sttcs.swipeTime;
                else
                    animTime = sttcs.fullTime * ( sttcs.width - distance ) / sttcs.width;
                if( curIdx == sttc.index )
                    tarPos  = sttcs.width * ( direction == 'left' ? -1 : 1 );
                else 
                    tarPos  = 0;
            }
            Util.notify( ctrl, 'autoTranslate', [ tarPos, animTime ] );
        }

    });

    return AppIcon;
});