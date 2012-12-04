
define( function( require, exports, module ){
    "use strick";

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
                [ 'assistiveOptionsClick' ]
            ]
        },

        statics : {
            assistivePointWidth  : 55,
            assistivePointHeight : 55,
            assistiveWidth       : 270,
            assistiveHeight      : 270
        },

        values : {
            touchStartHandleFunc : null,
            touchMoveHandleFunc  : null,
            touchStopHandleFunc  : null,
            assistiveOptionsClickFunc : null,
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

        _attachEventListener : function(){
            this.callParent();
            window.iOS.Event.addEvent( 'unlock', this.__unlockHandle, this );
        },

        _initComplete : function(){
            var sttc       = this.values,
                touchFuncs = this.__getTouchStartStopFunc();
            sttc.touchStartHandleFunc = touchFuncs[ 'touchStart' ];
            sttc.touchMoveHandleFunc  = touchFuncs[ 'touchMove' ];
            sttc.touchStopHandleFunc  = touchFuncs[ 'touchStop' ];
            sttc.assistiveOptionsClickFunc = touchFuncs[ 'assistiveOptionsClick' ];
            sttc.rangeClickInstance   = new RangeClick( touchFuncs );
        },

        _getDefaultData : function(){
            return require( '../../resource/defaultData/assistiveScreen/assistiveScreen' );
        },

        /**
         * [_dataReady 数据获取完成回调函数，会在此通知view绘制assistive上的cion]
         * @return {void}
         */
        _dataReady : function(){
            var sttc = this.values,
                ctrl = sttc.controller,
                renderData = sttc.data.data;
            this.__getAssistiveIconPotions();
            this.self.Util.notify( ctrl, 'renderChild', [ renderData ] );
        },

        __unlockHandle : function(){
            this.self.Util.notify( this.values.controller, 'showAssistivePoint' );
        },

        __getTouchStartStopFunc : function(){
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
                startPos, startTime, assistiveAreaPos;
            return {
                touchStart : touchStart,
                touchMove  : touchMove,
                touchStop  : touchStop,
                rangeClick : rangeClick,
                assistiveOptionsClick : assistiveOptionsClick
            };
            function touchStart( event ){
                if( sttc.pointTranslating )
                    return;
                Util.notify( ctrl, 'disableTransparent' );
                dragging   = true;
            }

            /**
             * [touchStop touchMove事件处理函数]
             * @param  {MouseEvent} event  [touchMove事件对象]
             * @param  {Object} disPos     [此时相较于touchStart的位移]
             * @return {void}
             */
            function touchMove( event, disPos ){
                if( !dragging || sttc.pointTranslating )
                    return;
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
            function touchStop( event, disPos ){
                if( sttc.pointTranslating )
                    return;
                var evtPos = that._getTouchPos( event, true ),
                    nowPos = {
                        x : disPos.x + curPos.x,
                        y : disPos.y + curPos.y
                    },
                    tarPos = {
                        x : null,
                        y : nowPos.y > 0 ? nowPos.y > boundary ? boundary : nowPos.y : 0
                    };
                if( ( nowPos.x + sttcs.assistivePointWidth / 2 ) > width / 2 ){
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

            function rangeClick(){
                var assistivePointPos = {};
                //FIXME
                assistiveAreaPos  = {
                    x : curPos.x - curDirection == 'right' ? sttcs.assistiveWidth : 0,
                    y : curPos.y - curDirection == 'right' ? sttcs.assistiveHeight : 0
                }
                if( curPos.y <= areaTop )
                    assistivePointPos.y = sttcs.assistivePointHeight / 2;
                else if( curPos.y >= ( areaTop + sttcs.assistiveHeight ) )
                    assistivePointPos.y = sttcs.assistiveHeight + sttcs.assistivePointHeight / 2;
                else
                    assistivePointPos.y = curPos.y - areaTop + sttcs.assistivePointHeight / 2;
                assistivePointPos.x     = ( curDirection == 'right' ? sttcs.assistiveWidth : 0 );
                Util.notify( ctrl, 'showAssistiveOptions', [ { x : areaLeft, y : areaTop }, assistiveAreaPos, assistivePointPos ] );
            }

            /**
             * [assistiveOptionsClick 当展现了assistive的时候，body上的单击时间]
             * @param  {MouseEvent} event         [事件对象]
             * @param  {DocumentDom} assistiveNode [assistive区域节点]
             * @return {void}
             */
            function assistiveOptionsClick( event, assistiveNode ){
                var target  = event.target,
                contain = target.compareDocumentPosition( assistiveNode );
                /*
                 * contain == 8 表示assistiveNode包含target节点。
                 */
                contain && contain != 8 && sttcs.Util.notify( sttc.controller, 'hideAssistiveOptions', [ assistiveAreaPos ] );
            }
        },

        /**
         * [__getAssistiveIconPotions 获取assistive的Icon的位置信息，根据不同的数量呈现不同的形式]
         * @return {void} 
         */
        __getAssistiveIconPotions : function(){
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