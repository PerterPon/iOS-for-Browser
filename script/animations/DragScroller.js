Ext.namespace('iOS.ux');

(function(){
    
    function ScrollView(el, config){
        this.init(el, config);
    };
    
    ScrollView.prototype = {

        useIndicators  : true,
    
        indicatorConfig: {},
    
        indicatorMargin: 4,
        
        init: function(el, config) {
            var indicators = [],
                directions = ['vertical', 'horizontal'];
            
            ['useIndicators', 'indicatorConfig', 'indicatorMargin'].forEach(function(c) {
                if (config.hasOwnProperty(c)) {
                    this[c] = config[c];
                    delete config[c];
                }
            }, this);  
            config.scrollView = this;
            this.scroller     = new Scroller(el, config);
            
            if (this.useIndicators === true) {
                directions.forEach(function(d) {
                    if (this.scroller[d]) {
                        indicators.push(d);
                    }
                }, this);
            } else if (directions.indexOf(this.useIndicators) !== -1) {
                indicators.push(this.useIndicators);
            }
    
            this.indicators            = {};
            this.indicatorOffsetExtras = {};
    
            indicators.forEach(function(i) {
                this.indicators[i] = new Indicator(this.scroller.container, $.extend({}, this.indicatorConfig, {type: i}));
            }, this);
            
            this.scroller.addHandler('scrollstart', this.onScrollStart, this);
            this.scroller.addHandler('scrollend',   this.onScrollEnd,   this);
            this.scroller.addHandler('scroll',      this.onScroll,      this);
        },
    
        onScrollStart: function() {
            this.showIndicators();
        },
    
        onScrollEnd: function() {
            this.hideIndicators();
        },
    
        onScroll: function(offset) {
            var scroller = this.scroller;
            if (scroller.offsetBoundary == null || (!this.indicators.vertical && !this.indicators.horizontal))
                return;
            var sizeAxis,
                offsetAxis,
                offsetMark,
                isVertical,
                indicator,
                boundary = scroller.offsetBoundary,
                offset   = scroller.offset;
    
            this.containerSize    = scroller.containerBox;
            this.scrollerSize     = scroller.size;
            this.outOfBoundOffset = boundary.getOutOfBoundOffset(offset);
            this.restrictedOffset = boundary.restrict(offset);
            this.boundarySize     = boundary.getSize();
    
            if (!this.indicatorSizes) {
                this.indicatorSizes   = {vertical: 0, horizontal: 0};
            }
    
            if (!this.indicatorOffsets) {
                this.indicatorOffsets = {vertical: 0, horizontal: 0};
            }
            
            for(var axis in this.indicators){
                indicator  = this.indicators[axis];
                isVertical = axis == 'vertical';
                if(isVertical && !scroller.vertical){
                    continue;
                }else if(!isVertical && !scroller.horizontal){
                    continue;
                }
                sizeAxis   = isVertical ? 'height' : 'width';
                offsetAxis = isVertical ? 'y'      : 'x';
                offsetMark = isVertical ? 'bottom' : 'right';
    
                if (this.scrollerSize[sizeAxis] < this.containerSize[sizeAxis]) {
                    this.indicatorSizes[axis] = this.containerSize[sizeAxis] * (this.scrollerSize[sizeAxis] / this.containerSize[sizeAxis]);
                }
                else {
                    this.indicatorSizes[axis] = this.containerSize[sizeAxis] * (this.containerSize[sizeAxis] / this.scrollerSize[sizeAxis]);
                }
                this.indicatorSizes[axis]    -= Math.abs(this.outOfBoundOffset[offsetAxis]);
                this.indicatorSizes[axis]     = Math.max(this.indicatorMargin * 4, this.indicatorSizes[axis]);
    
                if (this.boundarySize[sizeAxis] != 0) {
                    this.indicatorOffsets[axis] = (((boundary[offsetMark] - this.restrictedOffset[offsetAxis]) / this.boundarySize[sizeAxis])
                                                  * (this.containerSize[sizeAxis] - this.indicatorSizes[axis]));
                } else if (offset[offsetAxis] < boundary[offsetMark]) {
                    this.indicatorOffsets[axis] = this.containerSize[sizeAxis] - this.indicatorSizes[axis];
                } else {
                    this.indicatorOffsets[axis] = 0;
                }
    
                indicator.setOffset(this.indicatorOffsetExtras[axis] + this.indicatorOffsets[axis] + this.indicatorMargin);
                indicator.setSize(this.indicatorSizes[axis] - (this.indicatorMargin * 2));
            }
        },
        
        showIndicators : function() {
            var indicator, isVertical;
            for(var axis in this.indicators){
                indicator  = this.indicators[axis];
                isVertical = axis == 'vertical';
                if(isVertical && !this.scroller.vertical){
                    continue;
                }else if(!isVertical && !this.scroller.horizontal){
                    continue;
                }
                indicator.show();
                this.indicatorOffsetExtras[axis] = indicator.el[0].parentNode[axis === 'vertical' ? 'scrollTop' : 'scrollLeft'];
            }
        },
    
        hideIndicators : function() {
            for(var axis in this.indicators){
                this.indicators[axis].hide();
            }
        }
    };
    
    
    function Scroller(el, config){
        this.init(el, config);
    };
    
    Scroller.prototype = {
        
        lastInfo        : null,
        
        el              : null,
        
        container       : null,
        
        gesture         : null,
        
        baseCls         : '',
    
        draggingCls     : '',
        
        direction       : 'both',
        
        outOfBoundRestrictFactor: {
            x           : 1,
            y           : 0.5
        },
        
        acceleration    : 20,
    
        autoAdjustFps   : false,
    
        friction        : 0.5,
        
        startMomentumResetTime: 350,
    
        springTension   : 0.3,
        
        minVelocityForAnimation: 1,
    
        bounces         : true,
        
        threshold       : 5,
        
        
        theta                  : null,
        
        bouncingVelocityFactor : null,
        
        bouncingTimeFactor     : null,
        
        decelerationAnimation  : null,
        
        bouncingAnimation      : null,
        
        
        offsetBoundary             : null,
    
        dragging                   : false,
    
        vertical                   : false,
    
        horizontal                 : false,
        
        animationDuration          : 300,
                                   
        fps                        : null,
        
        updateBoundaryOnTouchStart : true,

        grid: null,
        snap: null,
        proxy: null,
        stack: false,
    
        
        handlers                   : null,
    
        init: function(el, config){
            this.el  = $(el);
            $.extend(this, config);
            var is   = $.support.is;
            this.fps = is.Blackberry ? 25 : (is.iOS || is.Desktop ? 80 : 50),
            this.handlers        = {};
            this.container       = this.el.parent();
            this.gesture         = new iOS.ux.Gesture(this.el);
            this.offset          = $.offsetUtil();
            this.setDirection(this.direction);
            this.el.addClass(this.baseCls);
            this.updateBoundary(true);
            this.setDragging(false);
            this.el.addClass('x-scroller');
            this.container.addClass('x-scroller-parent');
            var both     = this.bounces === 'both' || this.bounces === true;
            this.bounces = {
                x: (both || this.bounces === 'horizontal'),
                y: (both || this.bounces === 'vertical'  )
            };
            this.theta                  = Math.log(1 - (this.friction / 10));
            this.bouncingVelocityFactor = this.springTension * Math.E;
            this.bouncingTimeFactor     = ((1 / this.springTension) * this.acceleration);
            this.decelerationAnimation  = {};
            this.bouncingAnimation      = {};
            this.initAnimationInfo();
            
            this.listen();
        },
        
        initAnimationInfo: function(){
            ['x', 'y'].forEach(function(a) {
                if (!this.decelerationAnimation[a]) {
                    this.decelerationAnimation[a] = new Animation.Deceleration({
                        acceleration: this.acceleration,
                        theta       : this.theta
                    });
                }
    
                if (!this.bouncingAnimation[a]) {
                    this.bouncingAnimation[a]     = new Animation.Bouncing({
                        acceleration : this.acceleration,
                        springTension: this.springTension
                    });
                }
            }, this);
        },
        
        snapToBoundary: function(animate) {
            var offset = this.offsetBoundary.restrict(this.offset);
            this.setOffset(offset, animate);
        },
        
        listen: function() {
            var that = this;
            this.gesture.addHandlers({
                start : function(e, info){
                    that.doStart(e, info);
                    that.stopMomentumAnimation();
                },
                move  : function(e, info){
                    that.doMove(e, info);
                },
                end   : function(e, info){
                    that.doEnd(e, info);
                }
            });
        },
        
        updateBoundary: function(init) {
            var offsetBoundary, currentComputedOffset;
            init       = !!init;
            var el     = this.el[0];
            this.size  = {
                width  : el.scrollWidth,
                height : el.scrollHeight
            };
            this.containerBox = this.container.pageBox();
            var elXY          = this.el.getXY();
            this.elBox = {
                left   : elXY[0] - this.offset.x,
                top    : elXY[1] - this.offset.y,
                width  : this.size.width,
                height : this.size.height
            };
            this.elBox.bottom  = this.elBox.top  + this.elBox.height;
            this.elBox.right   = this.elBox.left + this.elBox.width;
    
            this.initialRegion = this.region = $.regionUtil(
                elXY.top, elXY.left + this.elBox.width, elXY.top + this.elBox.height, elXY.left
            );
    
            var top    = 0,
                right  = 0,
                bottom = 0,
                left   = 0;
    
            if (this.elBox.left < this.containerBox.left) {
                right += this.containerBox.left - this.elBox.left;
            }
            else {
                left  -= this.elBox.left - this.containerBox.left;
            }
    
            if (this.elBox.right > this.containerBox.right) {
                left  -= this.elBox.right - this.containerBox.right;
            }
            else {
                right += this.containerBox.right - this.elBox.right;
            }
    
            if (this.elBox.top < this.containerBox.top) {
                bottom += this.containerBox.top - this.elBox.top;
            }
            else {
                top -= this.elBox.top - this.containerBox.top;
            }
    
            if (this.elBox.bottom > this.containerBox.bottom) {
                top -= this.elBox.bottom - this.containerBox.bottom;
            }
            else {
                bottom += this.containerBox.bottom - this.elBox.bottom;
            }
            offsetBoundary = $.regionUtil(top, right, bottom, left).round();
            if (this.offsetBoundary && this.offsetBoundary.equals(offsetBoundary)) {
                return this;
            }
            this.offsetBoundary       = offsetBoundary;
            currentComputedOffset     = this.el.transformOffset();
            if (!this.offset.equals(currentComputedOffset) || init) {
                this.setOffset(currentComputedOffset);
            }
            this.snapToBoundary();
        },
        
        setTransformOffset: function(offset, clean) {
            if (clean) {
                this.el[0].style.webkitTransform = '';
            } else {
                this.el.translate(offset);
            }
            return this;
        },
        
        setDragging: function(dragging) {
            if (dragging) {
                if (!this.dragging) {
                    this.dragging = true;
                    this.el.addClass(this.draggingCls);
                }
            } else {
                if (this.dragging) {
                    this.dragging = false;
                    this.el.removeClass(this.draggingCls);
                }
            }
            return this;
        },
        
        setDirection   : function(direction){
            this.direction      = direction;
            if (this.direction == 'both') {
                this.horizontal = true;
                this.vertical   = true;
            }
            else if (this.direction == 'horizontal') {
                this.horizontal = true;
                this.vertical   = false;
            }
            else {
                this.horizontal = false;
                this.vertical   = true;
            }
        },
        
        doStart: function(e, info) {
            if (this.updateBoundaryOnTouchStart) {
                this.updateBoundary();
            }
            this.setDragging(true);
            var touchs           = e.originalEvent.touches;
            var data             = (touchs && touchs.length > 0) ? touchs[0] : e;
            this.startTouchPoint = $.poitUtil(info.startX, info.startY);
            this.startOffset     = this.offset.copy();
            this.runFn('scrollstart', this.getOffset());
            this.setStartTime(e, info);
            this.lastEventTime   = info.time;
            this.startTimeOffset = this.offset.copy();
            this.isScrolling     = true;
        },
        
        setStartTime: function(e, info) {
            this.startTime         = info.time;
            this.originalStartTime = info.time;
        },
        
        doMove: function(e, info){
            if (!this.dragging) {
                return;
            }
            var touchs          = e.originalEvent.touches;
            var data            = (touchs && touchs.length > 0) ? touchs[0] : e;
            this.lastTouchPoint = $.poitUtil(data.pageX, data.pageY);
            var newOffset       = this.getNewOffsetFromTouchPoint(this.lastTouchPoint);
            if (this.offsetBoundary != null) {
                newOffset       = this.offsetBoundary.restrict(newOffset, this.outOfBoundRestrictFactor);
            }
            this.setOffset(newOffset);
            this.lastEventTime  = info.time;
            if (this.lastEventTime - this.startTime > this.startMomentumResetTime) {
                this.setStartTime(e, info);
                this.startTimeOffset = this.offset.copy();
            }
        },
        
        doEnd: function(e, info){
            
            if (this.dragging) {
                this.setDragging(false);
            }
            if ( !this.startMomentumAnimation(e, info) ) {
                this.fireScrollEndEvent();
            }
        },
        
        fireScrollEndEvent: function() {
            this.isScrolling         = false;
            this.isMomentumAnimating = false;
            this.snapToBoundary();
            this.runFn('scrollend', this.getOffset());
        },
        
        startMomentumAnimation: function(e, info) {
            var duration = Math.max(40, info.time - this.originalStartTime);
            if (
                duration > this.startMomentumResetTime && 
                !this.offsetBoundary.isOutOfBound(this.offset)
            ) {
                return false;
            }
    
            // Determine the duration of the momentum
            var minVelocity   = this.minVelocityForAnimation,
                currentVelocity ,
                currentOffset = this.offset.copy(),
                restrictedOffset,
                acceleration  = (duration / this.acceleration),
                that          = this;
    
            this.isBouncing     = {x: false, y: false};
            this.isDecelerating = {x: false, y: false};
            this.momentumAnimationStartTime      = info.time;
            this.momentumAnimationProcessingTime = 0;
            this.bouncingData   = {x: null, y: null};
    
            // Determine the deceleration velocity
            this.momentumAnimationStartVelocity = {
                x: (this.offset.x - this.startTimeOffset.x) / acceleration,
                y: (this.offset.y - this.startTimeOffset.y) / acceleration
            };
    
            this.momentumAnimationStartOffset   = currentOffset;
            
            ['x', 'y'].forEach(function(axis) {
    
                this.isDecelerating[axis] = (Math.abs(this.momentumAnimationStartVelocity[axis]) > minVelocity);
    
                if (this.bounces && this.bounces[axis]) {
                    restrictedOffset      = this.offsetBoundary.restrict(axis, currentOffset[axis]);
    
                    if (restrictedOffset !== currentOffset[axis]) {
                        currentVelocity   = (currentOffset[axis] - restrictedOffset) * this.bouncingVelocityFactor;
    
                        this.bouncingData[axis] = {
                            axis    : axis,
                            offset  : restrictedOffset,
                            time    : this.momentumAnimationStartTime,
                            velocity: currentVelocity
                        };
                        this.isBouncing[axis]     = true;
                        this.isDecelerating[axis] = false;
                        //this.fireEvent('bouncestart', this, this.bouncingData[axis]);
                        this.bouncingAnimation[axis].set({
                            startTime    : this.bouncingData[axis].time - this.bouncingTimeFactor,
                            startOffset  : this.bouncingData[axis].offset,
                            startVelocity: this.bouncingData[axis].velocity
                        });
                    }
                }
    
                if (this.isDecelerating[axis]) {
                    this.decelerationAnimation[axis].set({
                        startVelocity : this.momentumAnimationStartVelocity[axis],
                        startOffset   : this.momentumAnimationStartOffset[axis],
                        startTime     : this.momentumAnimationStartTime
                    });
                }
            }, this);
    
            if (this.isDecelerating.x || this.isDecelerating.y || this.isBouncing.x || this.isBouncing.y) {
                this.isMomentumAnimating            = true;
                this.momentumAnimationFramesHandled = 0;
                this.handleMomentumAnimationFrame();
                this.momentumAnimationTimer         = setInterval(function() {
                    that.handleMomentumAnimationFrame();
                }, this.getFrameDuration());
                return true;
            }
            return false;
        },
        
        handleMomentumAnimationFrame : function() {
            if (!this.isMomentumAnimating) {
                return;
            }
    
            var currentTime    = new Date(),
                newOffset      = this.offset.copy(),
                offsetBoundary = this.offsetBoundary,
                currentVelocity,
                restrictedOffset,
                outOfBoundDistance,
                offsetAxis;
    
            ['x', 'y'].forEach(function(axis) {
                if (this.isDecelerating[axis]) {
                    offsetAxis         = newOffset[axis];
                    newOffset[axis]    = this.decelerationAnimation[axis].getOffset();
                    currentVelocity    = this.momentumAnimationStartVelocity[axis] * this.decelerationAnimation[axis].getFrictionFactor();
                    outOfBoundDistance = offsetBoundary.getOutOfBoundOffset(axis, newOffset[axis]);
    
                    // If the new offset is out of boundary, we are going to start a bounce
                    if (outOfBoundDistance !== 0) {
                        restrictedOffset = offsetBoundary.restrict(axis, newOffset[axis]);
    
                        if (this.bounces && this.bounces[axis]) {
                            this.bouncingData[axis] = {
                                axis    : axis,
                                offset  : restrictedOffset,
                                time    : currentTime,
                                velocity: currentVelocity
                            };
                            this.bouncingAnimation[axis].set({
                                startTime    : this.bouncingData[axis].time,
                                startOffset  : this.bouncingData[axis].offset,
                                startVelocity: this.bouncingData[axis].velocity
                            });
                            this.isBouncing[axis] = true;
                        }else{
                            newOffset[axis]       = offsetAxis;
                        }
                        this.isDecelerating[axis] = false;
                    }
                    else if (Math.abs(currentVelocity) <= 1) {
                        this.isDecelerating[axis] = false;
                    }
                }
                else if (this.isBouncing[axis]) {
                    newOffset[axis]  = this.bouncingAnimation[axis].getOffset();
                    restrictedOffset = offsetBoundary.restrict(axis, newOffset[axis]);
    
                    if (Math.abs(newOffset[axis] - restrictedOffset) <= 1) {
                        this.isBouncing[axis] = false;
                        newOffset[axis]       = restrictedOffset;
                    }
                }
            }, this);
    
            if (!this.isDecelerating.x && !this.isDecelerating.y && !this.isBouncing.x && !this.isBouncing.y) {
                this.stopMomentumAnimation();
            }
            this.setOffset(newOffset);
        },
        
        stopMomentumAnimation: function() {
            if (this.isMomentumAnimating) {
                if (this.momentumAnimationTimer) {
                    clearInterval(this.momentumAnimationTimer);
                }
                this.isDecelerating = {};
                this.isBouncing     = {};
                this.fireScrollEndEvent();
            }
        },
    
        getFrameDuration: function() {
            return 1000 / this.fps;
        },
        
        setOffset: function(offset) {
            if (!this.horizontal) {
                offset.x = 0;
            }
    
            if (!this.vertical) {
                offset.y = 0;
            }
    
            if (!offset.isOffsetUtil) {
                offset = $.offsetUtil(offset.x, offset.y);
            }
            offset.round();
    
            if (!this.offset.equals(offset)) {
                this.offset = offset;
                this.region = $.regionUtil(
                    this.initialRegion.top    + offset.y,
                    this.initialRegion.right  + offset.x,
                    this.initialRegion.bottom + offset.y,
                    this.initialRegion.left   + offset.x
                );
                this.setTransformOffset(offset);
                this.onOffsetChange(this.offset);
            }
            return this;
        },
        
        onOffsetChange: function(offset){
            this.runFn('scroll', {
                x: -offset.x,
                y: -offset.y
            });
        },
        
        getNewOffsetFromTouchPoint: function(touchPoint) {
            var xDelta = touchPoint.x - this.startTouchPoint.x,
                yDelta = touchPoint.y - this.startTouchPoint.y,
                newOffset = this.offset.copy();
            
            if (xDelta == 0 && yDelta == 0) {
                return newOffset;
            }
    
            if (this.horizontal){
                newOffset.x = this.startOffset.x + xDelta;
            }
    
            if (this.vertical){
                newOffset.y = this.startOffset.y + yDelta;
            }

            return newOffset;
        },
    
        getOffset: function() {
            var offset = this.offset.copy();
            offset.y   = -offset.y;
            offset.x   = -offset.x;
            return offset;
        },
        
        addHandler : function(actName, fn, scope){
            var hs      = this.handlers;
            hs[actName] = hs[actName] || [];
            hs[actName].push([fn, scope]);
        },
        
        runFn: function(actName){
            var hs       = this.handlers;
            if( hs && hs[actName] ){
                var fns  = hs[actName];
                var args = Array.prototype.slice.call(arguments, 1);
                for(var i = 0, len = fns.length; i < len; i++){
                    fns[i][0].apply(fns[i][1], args);
                }
            }
        }
        
    };
    Scroller.prototype.on = Scroller.prototype.addHandler;
    
    var Animation    = {
        Deceleration : function(config){
            this.set(config || {});
            if (!this.startTime)
                this.startTime = new Date();
        },
        Bouncing     : function(config){
            this.set(config || {});
            if (!this.startTime)
                this.startTime = new Date();
        }
    };
    Animation.Deceleration.prototype = {
        acceleration : 30,
        theta        : null,
        startVelocity: null,
        startTime    : null,
        startOffset  : 0,
    
        set: function(name, value) {
            if ( $.type(name) == 'object' ) {
                $.extend(this, name);
            }
            else {
                this[name] = value;
            }
            return this;
        },
    
        getOffset: function() {
            return this.startOffset - this.startVelocity * (1 - this.getFrictionFactor()) / this.theta;
        },
    
        getFrictionFactor : function() {
            var deltaTime = new Date() - this.startTime;
            return Math.exp(deltaTime / this.acceleration * this.theta);
        }
    };
    Animation.Bouncing.prototype = {
        springTension: 0.3,
        acceleration : 30,
        startVelocity: null,
        startTime    : null,
        startOffset  : 0,
    
        set: function(name, value) {
            if ( $.type(name) == 'object' ) {
                $.extend(this, name);
            }
            else {
                this[name] = value;
            }
            return this;
        },
    
        getOffset: function() {
            var deltaTime = (Date.now() - this.startTime),
                powTime = (deltaTime / this.acceleration) * Math.pow(Math.E, -this.springTension * (deltaTime / this.acceleration));
    
            return this.startOffset + (this.startVelocity * powTime);
        }
    };
    
    
    function Indicator(container, config){
        this.init(container, config);
    };
    Indicator.prototype = {
        
        baseCls: 'x-scrollbar',
    
        ui     : 'dark',
    
        type   : 'horizontal',
    
        init: function(container, config) {
            this.container = container;
            $.extend(this, config);
            this.el        = $('<div></div>').appendTo(this.container).addClass(
                [this.baseCls, this.baseCls+'-'+this.type, this.baseCls+'-'+this.ui].join(' ')
            );
            this.offset    = $.offsetUtil();
            this.hide();
        },
        
        hide: function() {
            var me = this;
            if (this.hideTimer) {
                clearTimeout(this.hideTimer);
            }
            this.hideTimer = setTimeout(function() {
                me.el[0].style.opacity = 0;
            }, 100);
        },
    
        show: function() {
            if (this.hideTimer) {
                clearTimeout(this.hideTimer);
            }
            this.el[0].style.opacity = 1;
        },
        
        setVisibility: function(isVisible) {
            return this[isVisible ? 'show' : 'hide']();
        },
    
        setSize: function(size) {
            if (this.size && size > this.size) {
                size = Math.round(size);
            }
            this.el[0].style[(this.type == 'horizontal') ? 'width' : 'height'] = size + 'px';
            this.size = size;
        },
        
        setOffset: function(offset) {
            if (this.type == 'vertical') {
                this.offset.y = offset;
            } else {
                this.offset.x = offset;
            }
            var is = $.support.is;
            if (!is.iOS && !is.Desktop) {
                if (this.type == 'vertical') {
                    this.el[0].style.top  = this.offset.y + 'px';
                } else {
                    this.el[0].style.left = this.offset.x + 'px';
                }
            } else {
                this.el.translate(this.offset);
            }
        }
    
    };
    
    $.scrollView = function(el, config){
        return new ScrollView(el, config);
    };
    
    iOS.ux.Indicator = Indicator;
    
})();