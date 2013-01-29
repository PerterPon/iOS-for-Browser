
define( function( require, exports, module ){
    "use strict";

    require( './BaseModel' );
    var RangeClick = require( '../event/RangeClick' );
    Ext.define( 'AssistiveScreen', {
        extend : 'BaseModel',

        inheritableStatics : {
            eventList : [
                [ 'touchstart' ],
                [ 'touchmove' ],
                [ 'touchstop' ],
                [ 'assistivePointAutoTranslateComplete' ],
                [ 'assistiveOptionsClick' ],
                [ 'assistiveFuncIconClick' ],
                [ 'assistiveHideComplete' ]
            ]
        },

        statics : {
            assistivePointWidth  : 57,
            assistivePointHeight : 57,
            assistiveWidth       : 270,
            assistiveHeight      : 270
        },

        values : {
            touchStartHandleFunc : null,
            touchMoveHandleFunc  : null,
            touchStopHandleFunc  : null,
            assistiveOptionsClickFunc : null,
            assistiveFuncIconClickFunc: null,
            pointTranslating     : false,
            rangeClickInstance   : null
        },

        Etouchstart : function( event ){
            this.values.rangeClickInstance.touchStart( event );
        },

        Etouchmove : function( event ){
            this.values.rangeClickInstance.touchMove( event );
        },

        Etouchstop : function( event ){
            this.values.rangeClickInstance.touchStop( event );
        },

        EassistivePointAutoTranslateComplete : function(){
            this.values.pointTranslating = false;
        },

        EassistiveOptionsClick : function( event, assistiveNode ){
            this.values.assistiveOptionsClickFunc( event, assistiveNode );
        },

        EassistiveFuncIconClick : function( event ) {
            this.values.assistiveFuncIconClickFunc( event );
        },

        EassistiveHideComplete : function() {
            this.self.Util.notify( this.values.controller, 'enableTransparent' );
        },

        _initComplete : function(){
            var sttc       = this.values,
                touchFuncs = this.__getTouchStartStopFunc();
            sttc.touchStartHandleFunc = touchFuncs[ 'touchStart' ];
            sttc.touchMoveHandleFunc  = touchFuncs[ 'touchMove' ];
            sttc.touchStopHandleFunc  = touchFuncs[ 'touchStop' ];
            sttc.assistiveOptionsClickFunc  = touchFuncs[ 'assistiveOptionsClick' ];
            sttc.assistiveFuncIconClickFunc = touchFuncs[ 'assistiveFuncIconClick' ]; 
            sttc.rangeClickInstance   = new RangeClick( touchFuncs );
        },

        _getDefaultData : function() {
            return require( '../../resource/defaultData/assistiveScreen/assistiveScreen' );
        },

        /**
         * [_dataReady 数据获取完成回调函数，会在此通知view绘制assistive上的cion]
         * @return {void}
         */
        _dataReady : function() {
            var sttc = this.values,
                ctrl = sttc.controller,
                renderData = sttc.data.data;
            this.__getAssistiveIconPotions();
            this.self.Util.notify( ctrl, 'renderChild', [ renderData ] );
        },

        __getTouchStartStopFunc : function() {
            var sttc     = this.values,
                sttcs    = this.self,
                that     = this,
                Util     = sttcs.Util,
                ctrl     = sttc.controller,
                dragging = false,
                height   = window.iOS.System.height,
                width    = window.iOS.System.width,
                boundary = height - sttcs.assistivePointWidth,
                areaTop  = ( height - sttcs.assistiveHeight ) / 2,
                areaLeft = ( width  - sttcs.assistiveWidth ) / 2,
                curPos   = {
                    x : 0,
                    y : 0
                },
                curDirection = 'left',
                optionsShow  = false,
                startPos, startTime, assistiveAreaPos, curDisplayIcons;
            return {
                touchStart : touchStart,
                touchMove  : touchMove,
                touchStop  : touchStop,
                rangeClick : rangeClick,
                assistiveOptionsClick : assistiveOptionsClick,
                assistiveFuncIconClick: assistiveFuncIconClick
            };
            function touchStart( event ) {
                if( sttc.pointTranslating ) {
                    return;
                }
                Util.notify( ctrl, 'disableTransparent' );
                dragging   = true;
            }

            /**
             * [touchStop touchMove事件处理函数]
             * @param  {MouseEvent} event  [touchMove事件对象]
             * @param  {Object} disPos     [此时相较于touchStart的位移]
             * @return {void}
             */
            function touchMove( event, disPos ) {
                if( !dragging || sttc.pointTranslating ) {
                    return;
                }
                disPos.x += curPos.x;
                disPos.y += curPos.y;
                Util.notify( ctrl, 'translate', [ disPos ] );
            }

            /**
             * [touchStop touchEnd事件处理函数]
             * @param  {MouseEvent} event  [touchEnd事件对象]
             * @param  {Object} disPos     [此时相较于touchStart的位移]
             * @return {void}
             */
            function touchStop( event, disPos ) {
                if( sttc.pointTranslating ) {
                    return;
                }
                var evtPos = that._getTouchPos( event, true ),
                    nowPos = {
                        x : disPos.x + curPos.x,
                        y : disPos.y + curPos.y
                    },
                    tarPos = {
                        x : null,
                        y : nowPos.y > 0 ? nowPos.y > boundary ? boundary : nowPos.y : 0
                    };
                if( ( nowPos.x + sttcs.assistivePointWidth / 2 ) > width / 2 ) {
                    curDirection = 'right';
                    tarPos.x     = width - sttcs.assistivePointWidth;
                } else {
                    curDirection = 'left';
                    tarPos.x     = 0;
                }
                curPos     = tarPos;
                Util.notify( ctrl, 'enableTransparent' );
                Util.notify( ctrl, 'assistivePointAutoTranslate', [ tarPos ] );
                sttc.pointTranslating = true;
                dragging   = false;
            }

            function rangeClick() {
                if( optionsShow ){
                    return true;
                }
                var sceondary = {},
                    icons = sttc.data.data.icon;
                for( var i in icons ) {
                    sceondary[ icons[ i ][ 'name' ] ] = icons[ i ][ 'position' ];
                }
                curDisplayIcons = sceondary;
                optionsShow     = true;
                Util.notify( ctrl, 'showAssistiveOptions', [ { x : areaLeft, y : areaTop }, sceondary ] );
                return true;
            }

            /**
             * [assistiveOptionsClick 当展现了assistive的时候，body上的单击事件]
             * @param  {MouseEvent} event         [事件对象]
             * @return {void}
             */
            function assistiveOptionsClick( event ) {
                sttcs.Util.notify( sttc.controller, 'hideAssistiveOptions', [ curPos, curDisplayIcons ] );
                optionsShow = false;
            }

            /**
             * [assistiveFuncIconClick 单击了辅助界面上的功能按钮之后会调用如下函数]
             * @param  {[type]} event [事件对象]
             * @return {[type]}       [description]
             */
            function assistiveFuncIconClick( event ) {
                var target  = event.target,
                    btnName = target.attributes.name.value,
                    Event   = window.iOS.Event;
                optionsShow = false;
                sttcs.Util.notify( sttc.controller, 'hideAssistiveOptions', [ curPos, curDisplayIcons ] );
                switch( btnName ){
                    case 'home' :
                        Event.dispatchEvent( 'homeButtonClick' );
                        break;
                }
            }
        },

        /**
         * [__getAssistiveIconPotions 获取assistive的Icon的位置信息，根据不同的数量呈现不同的形式]
         * @return {void}
         */
        __getAssistiveIconPotions : function() {
            //FIXME:目前只考虑了只有4个icon的情况，其他数量都还没有添加。
            var sttc   = this.values,
                sttcs  = this.self,
                data   = sttc.data.data.icon,
                perDis = sttcs.assistiveWidth / 3,
                iconDis= ( perDis - 58 ) / 2,
                verDis = ( perDis - 73 ) / 2
            data[ 0 ][ 'position' ] = {
                x : perDis + iconDis,
                y : iconDis
            };
            data[ 1 ][ 'position' ] = {
                x : iconDis,
                y : perDis + verDis
            };
            data[ 2 ][ 'position' ] = {
                x : perDis * 2 + iconDis,
                y : perDis * 1 + verDis
            };
            data[ 3 ][ 'position' ] = {
                x : perDis * 1 + iconDis,
                y : perDis * 2 + verDis
            };
        }
    });

    return AssistiveScreen;
});