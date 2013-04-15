Ext.namespace('iOS.ux');

(function(){
    
    function Gesture(el, cfg){
        this.init(el, cfg);
    };
    
    Gesture.prototype = {
        
        touches         : 1,
        
        startX          : null,
        
        startY          : null,
        
        startTime       : null,
        
        dragging        : null,
        
        previousX       : null,
        
        previousY       : null,
        
        dragThreshold   : 5,
        
        handlers        : null,
        
        dragging        : false,
        
        init            : function(el, cfg){
            $.extend(this, cfg);
            this.handlers = {};
            this.listen(el);
        },
        
        listen          : function(el){
            var support = $.support;
            var that    = this;
            $(el).
                on(support.touchstart, function(e){
                    that.onTouchstart(e);
                }).
                on(support.touchstop,  function(e){
                    that.onTouchstop(e);
                }).
                on(support.touchmove,  function(e){
                    that.onTouchmove(e);
                });
        },
        
        isDragging     : function(info) {
            return (info.absDeltaX >= this.dragThreshold || info.absDeltaY >= this.dragThreshold);
        },
        
        getInfo : function(touch) {
            var time = (new Date()).getTime(),
                deltaX = touch.pageX - this.startX,
                deltaY = touch.pageY - this.startY,
                info   = {
                    startX            : this.startX,
                    startY            : this.startY,
                    previousX         : this.previousX,
                    previousY         : this.previousY,
                    pageX             : touch.pageX,
                    pageY             : touch.pageY,
                    deltaX            : deltaX,
                    deltaY            : deltaY,
                    absDeltaX         : Math.abs(deltaX),
                    absDeltaY         : Math.abs(deltaY),
                    previousDeltaX    : touch.pageX - this.previousX,
                    previousDeltaY    : touch.pageY - this.previousY,
                    time              : time,
                    startTime         : this.startTime,
                    previousTime      : this.previousTime,
                    deltaTime         : time - this.startTime,
                    previousDeltaTime : time - this.previousTime
                };
            this.previousTime = info.time;
            this.previousX    = info.pageX;
            this.previousY    = info.pageY;
            this.lastInfo     = info;
            return info;
        },
        
        onTouchstart   : function(e){
            var touches    = e.originalEvent.touches;
            if( touches && touches.length != this.touches ){
                return;
            }
            var data       = touches ? touches[0] : e;
            this.startX    = this.previousX    = data.pageX;
            this.startY    = this.previousY    = data.pageY;
            this.startTime = this.previousTime = (new Date()).getTime();
            this.dragging  = false;
        },
        
        onTouchstop    : function(e){
            if (this.dragging) {
                var touches = e.originalEvent.changedTouches;
                var data    = touches ? touches[0] : e;
                var info    = this.getInfo(data);
                this.runFn(e, info, 'end');
            }
            this.dragging = false;
        },
        
        onTouchmove    : function(e){
            var touches = e.originalEvent.touches;
            if( touches && touches.length != this.touches ){
                return;
            }
            var data    = touches ? touches[0] : e;
            var info    = this.getInfo(data);
            var hs      = this.handlers;
            if (!this.dragging) {
                if ( (!touches || touches.length == this.touches) && this.isDragging(info) ) {
                    this.runFn(e, info, 'start');
                    this.dragging = true;
                    this.runFn(e, info, 'move');
                }
            } else {
                this.runFn(e, info, 'move');
            }
        },
        
        runFn: function(e, info, actName){
            var hs = this.handlers;
            if( hs && hs[actName] ){
                var fns = hs[actName];
                for(var i = 0, len = fns.length; i < len; i++){
                    fns[i](e, info);
                }
            }
        },
        
        addHandlers    : function(handlers){
            var hs;
            for(var i in handlers){
                hs     = handlers[i];
                if( !$.isArray(hs) ){
                    hs = [hs];
                }
                this.handlers[i] = this.handlers[i] || [];
                Array.prototype.push.apply(this.handlers[i], hs);
            }
        }
        
    };
    
    iOS.ux.Gesture = Gesture;
    
})();