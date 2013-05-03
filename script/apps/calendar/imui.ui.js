//各种控件scroll等 日历,列表

(function($) {
    //    预处理，但safari不支持
    //    var JSONP = document.createElement("link");
    //    JSONP.rel = "prerender"; //prefetch for firefox
    //    JSONP.href = $.getAddrPrdfix() + "themes/images/im-loader-icon.png";

    //    document.getElementsByTagName("head")[0].appendChild(JSONP);
})(jQuery);

/*!
* iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
* Released under MIT license, http://cubiq.org/license
*/
(function($) {
    var m = Math,
	mround = function(r) { return r >> 0; },
	vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
		(/firefox/i).test(navigator.userAgent) ? 'Moz' :
		(/trident/i).test(navigator.userAgent) ? 'ms' :
		'opera' in window ? 'O' : '',

    // Browser capabilities
    isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
    isPlaybook = (/playbook/gi).test(navigator.appVersion), //黑莓
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion), //惠普webOs

    has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor + 'Transform' in document.documentElement.style,
    hasTransitionEnd = isIDevice || isPlaybook,

	nextFrame = (function() {
	    return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(callback) { return setTimeout(callback, 1); }
	})(),
	cancelFrame = (function() {
	    return window.cancelRequestAnimationFrame
			|| window.webkitCancelAnimationFrame
			|| window.webkitCancelRequestAnimationFrame
			|| window.mozCancelRequestAnimationFrame
			|| window.oCancelRequestAnimationFrame
			|| window.msCancelRequestAnimationFrame
			|| clearTimeout
	})(),

    // Events
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',

    // Helpers
	trnOpen = 'translate' + (has3d ? '3d(' : '('),
	trnClose = has3d ? ',0)' : ')',

    // Constructor
	iScroll = function(el, options) {
	    var that = this,
			doc = document,
			i;

	    that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
	    that.wrapper.style.overflow = 'hidden';
	    that.scroller = that.wrapper.children[0];

	    // Default options
	    that.options = {
	        hScroll: false, //zhengxin 修改 提高效率
	        vScroll: true,
	        x: 0,
	        y: 0,
	        bounce: true,
	        bounceLock: false,
	        momentum: true,
	        lockDirection: true,
	        useTransform: true,
	        useTransition: false,
	        topOffset: 0,
	        checkDOMChanges: false, 	// Experimental

	        // Scrollbar
	        hScrollbar: true,
	        vScrollbar: true,
	        fixedScrollbar: isAndroid,
	        hideScrollbar: has3d && (!window.chrome || isAndroid), //zhengxin 修改，chrome在滚动条的显示上存在问题，所以就不进行渐隐操作
	        fadeScrollbar: has3d, //zhengxin 修改
	        scrollbarClass: '',

	        // Zoom
	        zoom: false,
	        zoomMin: 1,
	        zoomMax: 4,
	        doubleTapZoom: 2,
	        wheelAction: 'scroll',

	        // Snap
	        snap: false,
	        snapThreshold: 1,

	        // Events
	        onRefresh: null,
	        onBeforeScrollStart: function(e) {
	            //放入move事件中
	            //e.preventDefault();
	        },
	        onScrollStart: null,
	        onBeforeScrollMove: null,
	        onScrollMove: null,
	        onBeforeScrollEnd: null,
	        onScrollEnd: null,
	        onTouchEnd: null,
	        onDestroy: null,
	        onZoomStart: null,
	        onZoom: null,
	        onZoomEnd: null
	    };

	    // User defined options
	    for (i in options) that.options[i] = options[i];

	    // Set starting position
	    that.x = that.options.x;
	    that.y = that.options.y;

	    // Normalize options
	    that.options.useTransform = hasTransform ? that.options.useTransform : false;
	    that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
	    that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
	    that.options.zoom = that.options.useTransform && that.options.zoom;
	    that.options.useTransition = hasTransitionEnd && that.options.useTransition;

	    // Helpers FIX ANDROID BUG!
	    // translate3d and scale doesn't work together! 
	    // Ignoring 3d ONLY WHEN YOU SET that.options.zoom
	    if (that.options.zoom && isAndroid) {
	        trnOpen = 'translate(';
	        trnClose = ')';
	    }

	    // Set some default styles
	    that.scroller.style[vendor + 'TransitionProperty'] = that.options.useTransform ? '-' + vendor.toLowerCase() + '-transform' : 'top left';
	    that.scroller.style[vendor + 'TransitionDuration'] = '0';
	    that.scroller.style[vendor + 'TransformOrigin'] = '0 0';
	    if (that.options.useTransition) that.scroller.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';

	    if (that.options.useTransform) that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;
	    else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

	    if (that.options.useTransition) that.options.fixedScrollbar = true;

	    that.refresh(0); //zhengxin 修改 for 第一次刷新时滚动条运动的动画时间为0，多为用在topOffset不为0的情况下

	    that._bind(RESIZE_EV, window);
	    that._bind(START_EV);
	    if (!hasTouch) {
	        that._bind('mouseout', that.wrapper);
	        if (that.options.wheelAction != 'none')
	            that._bind(WHEEL_EV);
	    }

	    if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function() {
	        that._checkDOMChanges();
	    }, 500);
	};

    // Prototype
    iScroll.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0, currPageY: 0,
        pagesX: [], pagesY: [],
        aniTime: null,
        wheelZoomCount: 0,

        handleEvent: function(e) {
            var that = this;
            switch (e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV: that._move(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
                case RESIZE_EV: that._resize(); break;
                case WHEEL_EV: that._wheel(e); break;
                case 'mouseout': that._mouseout(e); break;
                case 'webkitTransitionEnd': that._transitionEnd(e); break;
            }
        },

        _checkDOMChanges: function() {
            if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

            this.refresh();
        },

        _scrollbar: function(dir) {
            var that = this,
			doc = document,
			bar;

            if (!that[dir + 'Scrollbar']) {
                if (that[dir + 'ScrollbarWrapper']) {
                    if (hasTransform) that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = '';
                    that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
                    that[dir + 'ScrollbarWrapper'] = null;
                    that[dir + 'ScrollbarIndicator'] = null;
                }

                return;
            }

            if (!that[dir + 'ScrollbarWrapper']) {
                // Create the scrollbar wrapper
                bar = doc.createElement('div');

                if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
                else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

                bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:opacity;-' + vendor + '-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

                that.wrapper.appendChild(bar);
                that[dir + 'ScrollbarWrapper'] = bar;

                // Create the scrollbar indicator
                bar = doc.createElement('div');
                if (!that.options.scrollbarClass) {
                    bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-' + vendor + '-background-clip:padding-box;-' + vendor + '-box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';-' + vendor + '-border-radius:3px;border-radius:3px';
                }
                bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:-' + vendor + '-transform;-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-' + vendor + '-transition-duration:0;-' + vendor + '-transform:' + trnOpen + '0,0' + trnClose;
                if (that.options.useTransition) bar.style.cssText += ';-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

                that[dir + 'ScrollbarWrapper'].appendChild(bar);
                that[dir + 'ScrollbarIndicator'] = bar;
            }

            if (dir == 'h') {
                that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
                that.hScrollbarIndicatorSize = m.max(mround(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
                that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
                that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
                that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
            } else {
                that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
                that.vScrollbarIndicatorSize = m.max(mround(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
                that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
                that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
                that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
            }

            // Reset position
            that._scrollbarPos(dir, true);
        },

        _resize: function() {
            var that = this;
            if (that.scroller.offsetHeight) { //zhengxin 修改当前不显示的scroll不进行刷新操作
                setTimeout(function() { that.refresh(); }, isAndroid ? 200 : 0);
            }
        },

        _pos: function(x, y) {
            x = this.hScroll ? x : 0;
            y = this.vScroll ? y : 0;

            if (this.options.useTransform) {
                this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';
            } else {
                x = mround(x);
                y = mround(y);
                this.scroller.style.left = x + 'px';
                this.scroller.style.top = y + 'px';
            }

            this.x = x;
            this.y = y;

            this._scrollbarPos('h');
            this._scrollbarPos('v');
        },

        _scrollbarPos: function(dir, hidden) {
            var that = this,
			pos = dir == 'h' ? that.x : that.y,
			size;

            if (!that[dir + 'Scrollbar']) return;

            pos = that[dir + 'ScrollbarProp'] * pos;

            if (pos < 0) {
                if (!that.options.fixedScrollbar) {
                    size = that[dir + 'ScrollbarIndicatorSize'] + mround(pos * 3);
                    if (size < 8) size = 8;
                    that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                }
                pos = 0;
            } else if (pos > that[dir + 'ScrollbarMaxScroll']) {
                if (!that.options.fixedScrollbar) {
                    size = that[dir + 'ScrollbarIndicatorSize'] - mround((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
                    if (size < 8) size = 8;
                    that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                    pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
                } else {
                    pos = that[dir + 'ScrollbarMaxScroll'];
                }
            }

            that[dir + 'ScrollbarWrapper'].style[vendor + 'TransitionDelay'] = '0';
            that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
            that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;
        },

        _start: function(e) {
            var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;

            if (!that.enabled) return;

            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

            if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

            that.moved = false;
            that.animating = false;
            that.zoomed = false;
            that.distX = 0;
            that.distY = 0;
            that.absDistX = 0;
            that.absDistY = 0;
            that.dirX = 0;
            that.dirY = 0;

            setTimeout(function() { //zhengxin 修改
                that.refresh(true);
            }, 0);

            // Gesture start
            if (that.options.zoom && hasTouch && e.touches.length > 1) {
                c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
                c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
                that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

                that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
                that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

                if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
            }

            if (that.options.momentum) {
                if (that.options.useTransform) {
                    // Very lame general purpose alternative to CSSMatrix
                    matrix = getComputedStyle(that.scroller, null)[vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');
                    x = matrix[4] * 1;
                    y = matrix[5] * 1;
                } else {
                    x = getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '') * 1;
                    y = getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '') * 1;
                }

                if (x != that.x || y != that.y) {
                    if (that.options.useTransition) that._unbind('webkitTransitionEnd');
                    else cancelFrame(that.aniTime);
                    that.steps = [];
                    that._pos(x, y);
                }
            }

            that.absStartX = that.x; // Needed by snap threshold
            that.absStartY = that.y;

            that.startX = that.x;
            that.startY = that.y;
            that.pointX = point.pageX;
            that.pointY = point.pageY;

            that.startTime = e.timeStamp || Date.now();

            if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

            that._bind(MOVE_EV);
            that._bind(END_EV);
            that._bind(CANCEL_EV);
        },

        _move: function(e) {
            var that = this,
            point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2, scale,
			timestamp = e.timeStamp || Date.now();

            //从onBeforeScrollStart事件中转移到这里，使不进行拖拽的时候，可以执行默认事件
            e.preventDefault();

            if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

            // Zoom
            if (that.options.zoom && hasTouch && e.touches.length > 1) {
                c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
                c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
                that.touchesDist = m.sqrt(c1 * c1 + c2 * c2);

                that.zoomed = true;

                scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

                if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
                else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

                that.lastScale = scale / this.scale;

                newX = this.originX - this.originX * that.lastScale + this.x,
			newY = this.originY - this.originY * that.lastScale + this.y;

                this.scroller.style[vendor + 'Transform'] = trnOpen + newX + 'px,' + newY + 'px' + trnClose + ' scale(' + scale + ')';

                if (that.options.onZoom) that.options.onZoom.call(that, e);
                return;
            }

            that.pointX = point.pageX;
            that.pointY = point.pageY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < that.maxScrollX) {
                newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
            }
            if (newY > that.minScrollY || newY < that.maxScrollY) {
                newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
            }

            that.distX += deltaX;
            that.distY += deltaY;
            that.absDistX = m.abs(that.distX);
            that.absDistY = m.abs(that.distY);

            if (that.absDistX < 6 && that.absDistY < 6) {
                return;
            }

            // Lock direction
            if (that.options.lockDirection) {
                if (that.absDistX > that.absDistY + 5) {
                    newY = that.y;
                    deltaY = 0;
                } else if (that.absDistY > that.absDistX + 5) {
                    newX = that.x;
                    deltaX = 0;
                }
            }

            that.moved = true;
            that._pos(newX, newY);
            that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (timestamp - that.startTime > 300) {
                that.startTime = timestamp;
                that.startX = that.x;
                that.startY = that.y;
            }

            if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
        },

        _end: function(e) {
            if (hasTouch && e.touches.length != 0) return;

            var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist: 0, time: 0 },
			momentumY = { dist: 0, time: 0 },
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap,
			scale;

            that._unbind(MOVE_EV);
            that._unbind(END_EV);
            that._unbind(CANCEL_EV);

            if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

            if (that.zoomed) {
                scale = that.scale * that.lastScale;
                scale = Math.max(that.options.zoomMin, scale);
                scale = Math.min(that.options.zoomMax, scale);
                that.lastScale = scale / that.scale;
                that.scale = scale;

                that.x = that.originX - that.originX * that.lastScale + that.x;
                that.y = that.originY - that.originY * that.lastScale + that.y;

                that.scroller.style[vendor + 'TransitionDuration'] = '200ms';
                that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';

                that.zoomed = false;
                that.refresh();

                if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                return;
            }

            if (!that.moved) {
                if (hasTouch) {
                    if (that.doubleTapTimer && that.options.zoom) {
                        // Double tapped
                        clearTimeout(that.doubleTapTimer);
                        that.doubleTapTimer = null;
                        if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                        that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
                        if (that.options.onZoomEnd) {
                            setTimeout(function() {
                                that.options.onZoomEnd.call(that, e);
                            }, 200); // 200 is default zoom duration
                        }
                    } else {
                        that.doubleTapTimer = setTimeout(function() {
                            that.doubleTapTimer = null;

                            // Find the last touched element
                            target = point.target;
                            while (target.nodeType != 1) target = target.parentNode;

                            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                                ev = document.createEvent('MouseEvents');
                                ev.initMouseEvent('click', true, true, e.view, 1,
								point.screenX, point.screenY, point.clientX, point.clientY,
								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
								0, null);
                                ev._fake = true;
                                target.dispatchEvent(ev);
                            }
                        }, that.options.zoom ? 250 : 0);
                    }
                }

                that._resetPos(200);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            if (duration < 300 && that.options.momentum) {
                momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
                momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

                newPosX = that.x + momentumX.dist;
                newPosY = that.y + momentumY.dist;

                if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist: 0, time: 0 };
                if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist: 0, time: 0 };
            }

            if (momentumX.dist || momentumY.dist) {
                newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

                // Do we need to snap?
                if (that.options.snap) {
                    distX = newPosX - that.absStartX;
                    distY = newPosY - that.absStartY;
                    if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
                    else {
                        snap = that._snap(newPosX, newPosY);
                        newPosX = snap.x;
                        newPosY = snap.y;
                        newDuration = m.max(snap.time, newDuration);
                    }
                }

                that.scrollTo(mround(newPosX), mround(newPosY), newDuration);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            // Do we need to snap?
            if (that.options.snap) {
                distX = newPosX - that.absStartX;
                distY = newPosY - that.absStartY;
                if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
                else {
                    snap = that._snap(that.x, that.y);
                    if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
                }

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            that._resetPos(200);
            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
        },

        _resetPos: function(time) {
            var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

            if (resetX == that.x && resetY == that.y) {
                if (that.moved) {
                    that.moved = false;
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that); 	// Execute custom code on scroll end
                }

                if (that.hScrollbar && that.options.hideScrollbar) {
                    if (vendor == 'webkit') that.hScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
                    that.hScrollbarWrapper.style.opacity = '0';
                }
                if (that.vScrollbar && that.options.hideScrollbar) {
                    if (vendor == 'webkit') that.vScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
                    that.vScrollbarWrapper.style.opacity = '0';
                }

                return;
            }

            that.scrollTo(resetX, resetY, time || 0);
        },

        _wheel: function(e) {
            var that = this,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale;

            if ('wheelDeltaX' in e) {
                wheelDeltaX = e.wheelDeltaX / 12;
                wheelDeltaY = e.wheelDeltaY / 12;
            } else if ('wheelDelta' in e) {
                wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
            } else if ('detail' in e) {
                wheelDeltaX = wheelDeltaY = -e.detail * 3;
            } else {
                return;
            }

            if (that.options.wheelAction == 'zoom') {
                deltaScale = that.scale * Math.pow(2, 1 / 3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
                if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
                if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;

                if (deltaScale != that.scale) {
                    if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                    that.wheelZoomCount++;

                    that.zoom(e.pageX, e.pageY, deltaScale, 400);

                    setTimeout(function() {
                        that.wheelZoomCount--;
                        if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                    }, 400);
                }

                return;
            }

            deltaX = that.x + wheelDeltaX;
            deltaY = that.y + wheelDeltaY;

            if (deltaX > 0) deltaX = 0;
            else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

            if (deltaY > that.minScrollY) deltaY = that.minScrollY;
            else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;

            that.scrollTo(deltaX, deltaY, 0);
        },

        _mouseout: function(e) {
            var t = e.relatedTarget;

            if (!t) {
                this._end(e);
                return;
            }

            while (t = t.parentNode) if (t == this.wrapper) return;

            this._end(e);
        },

        _transitionEnd: function(e) {
            var that = this;

            if (e.target != that.scroller) return;

            that._unbind('webkitTransitionEnd');

            that._startAni();
        },


        /**
        *
        * Utilities
        *
        */
        _startAni: function() {
            var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;

            if (that.animating) return;

            if (!that.steps.length) {
                that._resetPos(400);
                return;
            }

            step = that.steps.shift();

            if (step.x == startX && step.y == startY) step.time = 0;

            that.animating = true;
            that.moved = true;

            if (that.options.useTransition) {
                that._transitionTime(step.time);
                that._pos(step.x, step.y);
                that.animating = false;
                if (step.time) that._bind('webkitTransitionEnd');
                else that._resetPos(0);
                return;
            }

            animate = function() {
                var now = Date.now(),
				newX, newY;

                if (now >= startTime + step.time) {
                    that._pos(step.x, step.y);
                    that.animating = false;
                    if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that); 		// Execute custom code on animation end
                    that._startAni();
                    return;
                }

                now = (now - startTime) / step.time - 1;
                easeOut = m.sqrt(1 - now * now);
                newX = (step.x - startX) * easeOut + startX;
                newY = (step.y - startY) * easeOut + startY;
                that._pos(newX, newY);
                if (that.animating) that.aniTime = nextFrame(animate);
            };

            animate();
        },

        _transitionTime: function(time) {
            time += 'ms';
            this.scroller.style[vendor + 'TransitionDuration'] = time;
            if (this.hScrollbar) this.hScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
            if (this.vScrollbar) this.vScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
        },

        _momentum: function(dist, time, maxDistUpper, maxDistLower, size) {
            var deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

            // Proportinally reduce speed if we are outside of the boundaries 
            if (dist > 0 && newDist > maxDistUpper) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistUpper = maxDistUpper + outsideDist;
                speed = speed * maxDistUpper / newDist;
                newDist = maxDistUpper;
            } else if (dist < 0 && newDist > maxDistLower) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistLower = maxDistLower + outsideDist;
                speed = speed * maxDistLower / newDist;
                newDist = maxDistLower;
            }

            newDist = newDist * (dist < 0 ? -1 : 1);
            newTime = speed / deceleration;

            return { dist: newDist, time: mround(newTime) };
        },

        _offset: function(el) {
            var left = -el.offsetLeft,
			top = -el.offsetTop;

            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }

            if (el != this.wrapper) {
                left *= this.scale;
                top *= this.scale;
            }

            return { left: left, top: top };
        },

        _snap: function(x, y) {
            var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

            // Check page X
            page = that.pagesX.length - 1;
            for (i = 0, l = that.pagesX.length; i < l; i++) {
                if (x >= that.pagesX[i]) {
                    page = i;
                    break;
                }
            }
            if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
            x = that.pagesX[page];
            sizeX = m.abs(x - that.pagesX[that.currPageX]);
            sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
            that.currPageX = page;

            // Check page Y
            page = that.pagesY.length - 1;
            for (i = 0; i < page; i++) {
                if (y >= that.pagesY[i]) {
                    page = i;
                    break;
                }
            }
            if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
            y = that.pagesY[page];
            sizeY = m.abs(y - that.pagesY[that.currPageY]);
            sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
            that.currPageY = page;

            // Snap with constant speed (proportional duration)
            time = mround(m.max(sizeX, sizeY)) || 200;

            return { x: x, y: y, time: time };
        },

        _bind: function(type, el, bubble) {
            (el || this.scroller).addEventListener(type, this, !!bubble);
        },

        _unbind: function(type, el, bubble) {
            (el || this.scroller).removeEventListener(type, this, !!bubble);
        },


        /**
        *
        * Public methods
        *
        */
        destroy: function() {
            var that = this;

            that.scroller.style[vendor + 'Transform'] = '';

            // Remove the scrollbars
            that.hScrollbar = false;
            that.vScrollbar = false;
            that._scrollbar('h');
            that._scrollbar('v');

            // Remove the event listeners
            that._unbind(RESIZE_EV, window);
            that._unbind(START_EV);
            that._unbind(MOVE_EV);
            that._unbind(END_EV);
            that._unbind(CANCEL_EV);

            if (!that.options.hasTouch) {
                that._unbind('mouseout', that.wrapper);
                that._unbind(WHEEL_EV);
            }

            if (that.options.useTransition) that._unbind('webkitTransitionEnd');

            if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);

            if (that.options.onDestroy) that.options.onDestroy.call(that);
        },

        refresh: function(time, isStart) { //zhengxin 修改 增加了time参数和isStart参数，在触发_start事件的时候不去改变minScrollY，不触发onRefresh，不执行_resetPos运动，只是设置长度，for 拖拽刷新
            var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;

            if ($.typesOf(time, "boolean")) { //zhengxin 修改 进行缺省值判断
                isStart = time;
                time = undefined;
            }

            if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
            that.wrapperW = that.wrapper.clientWidth || 1;
            that.wrapperH = that.wrapper.clientHeight || 1;

            if (!isStart) that.minScrollY = -that.options.topOffset || 0;  //zhengxin 修改 增加isStart判断
            that.scrollerW = mround(that.scroller.offsetWidth * that.scale);
            that.scrollerH = mround((that.scroller.offsetHeight + that.minScrollY) * that.scale);
            that.maxScrollX = that.wrapperW - that.scrollerW;
            that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
            that.dirX = 0;
            that.dirY = 0;

            if (that.options.onRefresh && !isStart) that.options.onRefresh.call(that);

            that.hScroll = that.options.hScroll && that.maxScrollX < 0;
            that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

            that.hScrollbar = that.hScroll && that.options.hScrollbar;
            that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

            offset = that._offset(that.wrapper);
            that.wrapperOffsetLeft = -offset.left;
            that.wrapperOffsetTop = -offset.top;

            // Prepare snap
            if (typeof that.options.snap == 'string') {
                that.pagesX = [];
                that.pagesY = [];
                els = that.scroller.querySelectorAll(that.options.snap);
                for (i = 0, l = els.length; i < l; i++) {
                    pos = that._offset(els[i]);
                    pos.left += that.wrapperOffsetLeft;
                    pos.top += that.wrapperOffsetTop;
                    that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
                    that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
                }
            } else if (that.options.snap) {
                that.pagesX = [];
                while (pos >= that.maxScrollX) {
                    that.pagesX[page] = pos;
                    pos = pos - that.wrapperW;
                    page++;
                }
                if (that.maxScrollX % that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length - 1] + that.pagesX[that.pagesX.length - 1];

                pos = 0;
                page = 0;
                that.pagesY = [];
                while (pos >= that.maxScrollY) {
                    that.pagesY[page] = pos;
                    pos = pos - that.wrapperH;
                    page++;
                }
                if (that.maxScrollY % that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length - 1] + that.pagesY[that.pagesY.length - 1];
            }

            // Prepare the scrollbars
            that._scrollbar('h');
            that._scrollbar('v');

            if (!that.zoomed && !isStart) { //zhengxin 修改 增加isStart判断
                that.scroller.style[vendor + 'TransitionDuration'] = '0';
                that._resetPos($.typesOf(time, "number") ? time : 200); //zhengxin 修改 当time参数为数字的时候，使用time，默认为200
            }
        },

        scrollTo: function(x, y, time, relative) {
            var that = this,
			step = x,
			i, l;

            that.stop();

            if (!step.length) step = [{ x: x, y: y, time: time, relative: relative}];

            for (i = 0, l = step.length; i < l; i++) {
                if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
                that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
            }

            that._startAni();
        },

        scrollToElement: function(el, time) {
            var that = this, pos;
            el = el.nodeType ? el : that.scroller.querySelector(el);
            if (!el) return;

            pos = that._offset(el);
            pos.left += that.wrapperOffsetLeft;
            pos.top += that.wrapperOffsetTop;

            pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
            pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
            time = time === undefined ? m.max(m.abs(pos.left) * 2, m.abs(pos.top) * 2) : time;

            that.scrollTo(pos.left, pos.top, time);
        },

        scrollToPage: function(pageX, pageY, time) {
            var that = this, x, y;

            time = time === undefined ? 400 : time;

            if (that.options.onScrollStart) that.options.onScrollStart.call(that);

            if (that.options.snap) {
                pageX = pageX == 'next' ? that.currPageX + 1 : pageX == 'prev' ? that.currPageX - 1 : pageX;
                pageY = pageY == 'next' ? that.currPageY + 1 : pageY == 'prev' ? that.currPageY - 1 : pageY;

                pageX = pageX < 0 ? 0 : pageX > that.pagesX.length - 1 ? that.pagesX.length - 1 : pageX;
                pageY = pageY < 0 ? 0 : pageY > that.pagesY.length - 1 ? that.pagesY.length - 1 : pageY;

                that.currPageX = pageX;
                that.currPageY = pageY;
                x = that.pagesX[pageX];
                y = that.pagesY[pageY];
            } else {
                x = -that.wrapperW * pageX;
                y = -that.wrapperH * pageY;
                if (x < that.maxScrollX) x = that.maxScrollX;
                if (y < that.maxScrollY) y = that.maxScrollY;
            }

            that.scrollTo(x, y, time);
        },

        disable: function() {
            this.stop();
            this._resetPos(0);
            this.enabled = false;

            // If disabled after touchstart we make sure that there are no left over events
            this._unbind(MOVE_EV);
            this._unbind(END_EV);
            this._unbind(CANCEL_EV);
        },

        enable: function() {
            this.enabled = true;
        },

        stop: function() {
            if (this.options.useTransition) this._unbind('webkitTransitionEnd');
            else cancelFrame(this.aniTime);
            this.steps = [];
            this.moved = false;
            this.animating = false;
        },

        zoom: function(x, y, scale, time) {
            var that = this,
			relScale = scale / that.scale;

            if (!that.options.useTransform) return;

            that.zoomed = true;
            time = time === undefined ? 200 : time;
            x = x - that.wrapperOffsetLeft - that.x;
            y = y - that.wrapperOffsetTop - that.y;
            that.x = x - x * relScale + that.x;
            that.y = y - y * relScale + that.y;

            that.scale = scale;
            that.refresh();

            that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
            that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

            that.scroller.style[vendor + 'TransitionDuration'] = time + 'ms';
            that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + scale + ')';
            that.zoomed = false;
        },

        isReady: function() {
            return !this.moved && !this.zoomed && !this.animating;
        }
    };

    //to do 注意使用时存在一个地方又多个scroll或者scroll和x-scroller并存的现象
    var map = new $.NBMap(), key = 'sckey';
    $.fn.scrollTo = function(position, time) {
        var s = map.get(getScrollObject(this).attr(key)),
            	t = (!time && 0 != time) ? 250 : time;
        if (s) {
            s.scrollTo(0, position, t);
        }
        return this;
    };
    $.fn.disScroll = function() {
        map.remove(getScrollObject(this).attr(key));
        return this;
    };
    $.fn.refresh = function() {
        var s = map.get(getScrollObject(this).attr(key));
        if (s) {
            s.refresh();
        }
        return this;
    }
    $.fn.scroll = function(options) {
        var scrolls = getScrollObject(this);

        if (map.get(scrolls.attr(key))) {
            return this;
        }

        scrolls.wrapInner('<div></div>');
        var nbScroll = null;
        if (scrolls.length == 0) {
            return this;
        } else {
            //处理滚动区域内存在form元素而导致的bug及样式问题
            options = options ? options : {};
            if ($("input, select, textarea", scrolls).length) {
                options.useTransform = false;
                options.onBeforeScrollStart = function(e) {
                    var target = e.target;
                    while (target.nodeType != 1) target = target.parentNode;

                    //                    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                    //                        e.preventDefault();
                };
            }
            if (scrolls.hasClass("hscroll")) {
                options["hScroll"] = true;
                options["vScroll"] = false;
            }

            nbScroll = new iScroll(scrolls[0], options);
        }
        var skkey = key + String(m.random()).replace(/\D/g, "");
        map.put(skkey, nbScroll);
        scrolls.eq(0).attr(key, skkey);
        return this;
    };

    var getScrollObject = function(that) {
        return that.hasClass("x-scroller") || that.hasClass("scroll") || that.hasClass("hscroll") ? that : that.find('.x-scroller, .scroll, .hscroll');
    }

})(jQuery);

(function($) {
    var controllerCount = 1000, regInputType = /^(text|password|tel)$/i, hasTouch = 'ontouchstart' in window;
    var isApple = (/iphone|ipad/gi).test(navigator.appVersion), isAndroid = (/android/gi).test(navigator.appVersion);
    var eventStart = hasTouch ? 'touchstart' : 'mousedown',
        eventMove = hasTouch ? 'touchmove' : 'mousemove',
        eventEnd = hasTouch ? 'touchend' : 'mouseup',
        eventCancel = hasTouch ? 'touchcancel' : 'mouseup';
    var m = Math;
    var _d = new Date();
    var addrPrdfix = $.getAddrPrdfix();

    $.controllerBack = {};

    var setControllerHash = function(name) {
        var hash = window.location.hash,
            name = name ? name : "";
        if (!isApple) {
            if (/(controller)/i.test(hash)) {
                if (isAndroid || isApple) {
                    window.location.replace($.setQueryStr("controller", name));
                }
                else {
                    window.history.replaceState(null, null, $.setQueryStr("controller", name, hash)); //在android及ios5以前的版本不支持
                }
                $(window).trigger('hashchange');
            }
            else {
                window.location.hash += "&controller=" + name;
            }
        }
    }

    var getTopAndLeft = function(obj, container) {
        obj = obj.jquery ? obj[0] : obj;
        container = container && (container.jquery ? container : $(container)) || $(window);
        var m = Math;

        var selfHeight = m.max(obj.clientHeight, obj.offsetHeight, obj.scrollHeight, $(obj).height()),
            selfWidth = m.max(obj.clientWidth, obj.offsetWidth, obj.scrollWidth, $(obj).width());

        return {
            "top": (container.height() - selfHeight) / 2,
            "left": (container.width() - selfWidth) / 2
        };
    }

    var controllerGoBack = function(type) {
        $.controllerBack[type].call(null);
        delete $.controllerBack[type];
        if (!isApple && $.getQueryStr("controller") === type) {
            window.history.back();
        }
    }

    $.maskBox = function(name, className) {
        //防止出现因为没有使用new操作符来创建对象导致的bug
        if (!(this instanceof $.maskBox)) {
            return new $.maskBox(name, className);
        }

        var mask, currentInput, className = className ? className : "x-mask";

        if (isAndroid) {
            currentInput = $("div.current input, div.current select").attr("disabled", "disabled");
        }

        if (!$("div." + className)[0]) {
            mask = $("<div class='js-maskBox'><div>").attr("id", "im-mask-" + controllerCount++).addClass(className).css({ "height": window.innerHeight + "px", "width": window.innerWidth + "px" });
            $(document.body).append(mask);
        }
        else {
            mask = $("div.js-maskBox").removeClass("x-hide");
        }

        mask.data("controllerName", name);

        $(window).resize(function() {
            mask.css({ "height": window.innerHeight + "px", "width": window.innerWidth + "px" });
        });

        return {
            show: function(controllerName) {
                mask.data("controllerName", controllerName);
                mask.removeClass("x-hide");
                //todo apple fade
            },
            hide: function(controllerName) {
                //有些控件先后出现时，maskBox消失的处理
                if (!controllerName || controllerName === mask.data("controllerName")) {
                    mask.addClass("x-hide");
                    //todo apple fade
                    if (isAndroid && currentInput) {
                        currentInput.removeAttr("disabled");
                    }
                }
            },
            remove: function() {
                mask.remove();
            }
        }

    }

    $.loadingBox = function(message) {
        //防止出现因为没有使用new操作符来创建对象导致的bug
        if (!(this instanceof $.loadingBox)) {
            return new $.loadingBox(message);
        }

        var imMask = new $.maskBox("loadingBox"),
        loadingId = "im-loading-" + controllerCount++,
        imLoading,
        tl,
        spinner;

        message = (message || "Loading") + "…";

        if (!$("div.x-loading")[0]) {

            $("body").append('<div class="x-loading x-mask" id="' + loadingId + '"><div class="x-loading-spinner">'
                            + '<span class="x-loading-top"></span><span class="x-loading-right"></span><span class="x-loading-bottom">'
                            + '</span><span class="x-loading-left"></span></div><div class="x-loading-msg x-changeLine">' + message + '</div></div>');

            imLoading = $("div.x-loading");
            tl = getTopAndLeft(imLoading);
            imLoading.css({ "top": tl.top + "px", "left": tl.left + "px" });
        }
        else {
            imLoading = $("div.x-loading").removeClass("x-hide");
            $("div.x-loading-msg", imLoading).html(message);
        }

        spinner = $(".x-loading-spinner", imLoading).addClass("x-loading-animation");

        $(window).resize(function() {
            var tl = getTopAndLeft(imLoading);
            imLoading.css({ "top": tl.top + "px", "left": tl.left + "px" });
        });

        //用setTimeout来解决$(document).ready的时候导致history返回错误的bug
        setTimeout(function() {
            setControllerHash("loadingBox");
        }, 100);


        $.controllerBack.loadingBox = function() {
            imLoading.addClass("x-hide");
            spinner.removeClass("x-loading-animation");
            imMask.hide("loadingBox");
        }

        return {
            hide: function() {
                $.controllerBack.loadingBox();
                //用setTimeout来解决$(document).ready的时候导致history返回错误的bug
                setTimeout(function() {
                    if (!isApple && $.getQueryStr("controller") === "loadingBox") {
                        window.history.back();
                    }
                }, 150);
            },
            show: function() {
                imMask.show("loadingBox");
                $("#" + loadingId).removeClass("x-hide");
                setControllerHash("loadingBox");
            }
        }
    }

    $.loadingInContainer = function(container, message) {
        //防止出现因为没有使用new操作符来创建对象导致的bug
        if (!(this instanceof $.loadingInContainer)) {
            return new $.loadingInContainer(container, message);
        }

        if ($.isNotDOM(container)) {
            return;
        }

        var imLoading, spinner, html = [];
        message = message ? message + "…" : "";

        if (!$("> .x-loading-container", container)[0]) {

            html.push('<div class="x-loading-container" id="im-loading-' + controllerCount++ + '"><div class="x-loading-spinner">'
                        + '<span class="x-loading-top"></span><span class="x-loading-right"></span><span class="x-loading-bottom">'
                        + '</span><span class="x-loading-left"></span></div>');

            if (message) {
                html.push('<div class="x-loading-msg x-changeLine">' + message + '</div>');
            }

            html.push('</div>');

            container.append(html.join(""));

            imLoading = $(".x-loading-container");
        }
        else {
            imLoading = $(".x-loading-container").removeClass("x-hide");
            $("div.x-loading-msg", imLoading).html(message);
        }

        spinner = $(".x-loading-spinner", imLoading).addClass("x-loading-animation");

        return {
            hide: function() {
                imLoading.addClass("x-hide");
                spinner.removeClass("x-loading-animation");
            },
            show: function() {
                spinner.addClass("x-loading-animation");
                imLoading.removeClass("x-hide");
            }
        }
    }

    /*** msgBox ***/

    var createMsgBox = function(message, title) {
        //todo 创建优化

        var imMsgBox = $("<div></div>").attr("id", "im-msgbox-" + controllerCount++).addClass("x-msgbox x-floating");

        var content = $("<div class='x-msgbox-title'>" + title + "</div><div class='x-msgbox-body x-changeLine'><div class='x-msgbox-text'>" + message
                         + "</div><div class='x-msgbox-inputs x-hide'><input type='text' class='x-msgbox-input x-hide' id='im-input-" + controllerCount++ + "' autocomplete='off' autocapitalize='off' autocorrect='off' />" //取消自动匹配列表, 自动大写单词字母, 取消自动完成,  autofocus='on'出现后获得焦点(适用于Mobile上)
                         + "<input type='password' class='x-msgbox-input x-hide' id='im-input-" + controllerCount++ + "' autocomplete='off' autocapitalize='off' autocorrect='off' />"
                         + "<input type='tel' class='x-msgbox-input x-hide' id='im-input-" + controllerCount++ + "' autocomplete='off' autocapitalize='off' autocorrect='off' />"
                         + "<textarea class='x-msgbox-input x-hide' id='im-input-" + controllerCount++ + "' autocomplete='off' autocapitalize='off' autocorrect='off' />"
                         + "</div></div><div class='x-msgbox-bottom'><div class='x-button x-button-cancel x-hide'><span class='x-button-label'>Cancel"
                         + "</span></div><div class='x-button-interval x-hide'></div><div class='x-button x-button-action'><span class='x-button-label'>OK</span></div>");

        imMsgBox.append(content).appendTo($(document.body));

        return imMsgBox;
    }

    var msgBoxHandler = function(imMsgBox, imMask) {
        $("div.x-button", imMsgBox).removeClass("x-button-pressed");

        var tl = getTopAndLeft(imMsgBox);
        imMsgBox.css({ "top": tl.top + "px", "left": tl.left + "px", "webkitTransform": "scale(0.01)", "opacity": "0" });

        setTimeout(function() {
            imMsgBox.transition({ "webkitTransform": "scale(1)", "opacity": "1" }, function() {
                imMsgBox.removeStyle("-webkit-transform,opacity");
            });
        }, 10);

        $(window).resize(function() {
            if (!imMsgBox.hasClass("x-hide")) {
                var tl = getTopAndLeft(imMsgBox);
                imMsgBox.css({ "top": tl.top + "px", "left": tl.left + "px" });
            }
        });

        setControllerHash("messageBox");

        $.controllerBack.messageBox = function() {
            imMsgBox.transition({ "webkitTransform": "scale(0.01)", "opacity": "0" }, function() {
                imMsgBox.addClass("x-hide").css("top", window.innerHeight).removeStyle("-webkit-transform,opacity"); ;
                imMask.hide("messageBox");
            });
        }
    }

    $.alert = function(message, completeCallback, title, buttonLabel) {
        var imMask = new $.maskBox("messageBox"), imAlert;
        title = title || "提示";
        buttonLabel = buttonLabel || "确定";

        if (!$("div.x-msgbox")[0]) {
            imAlert = createMsgBox(message, title);
        }
        else {
            imAlert = $("div.x-msgbox").removeClass("x-hide");
            $("div.x-msgbox-title", imAlert).html(title);
            $("div.x-msgbox-text", imAlert).html(message);
            $(".x-button-interval, .x-button-cancel, .x-msgbox-inputs", imAlert).addClass("x-hide");
        }

        $("div.x-button-action span.x-button-label", imAlert).html(buttonLabel);

        msgBoxHandler(imAlert, imMask);

        $("div.x-button", imAlert).unbind('tap').bind('tap', function() {
            controllerGoBack("messageBox");

            if (completeCallback && $.isFunction(completeCallback)) {
                completeCallback.call();
            }
        });
    }

    $.confirm = function(message, resultCallback, title, buttonLabels) {
        var imMask = new $.maskBox("messageBox"), imConfirm;
        title = title || "确认";
        buttonLabels = buttonLabels ? $.typesOf(buttonLabels) === "string" ? buttonLabels.split(",") : buttonLabels : ["取消", "确定"];

        if (!$("div.x-msgbox")[0]) {
            imConfirm = createMsgBox(message, title);
        }
        else {
            imConfirm = $("div.x-msgbox").removeClass("x-hide");
            $("div.x-msgbox-title", imConfirm).html(title);
            $("div.x-msgbox-text", imConfirm).html(message);
            $("div.x-msgbox-inputs", imConfirm).addClass("x-hide");
        }

        $("span.x-button-label", imConfirm).each(function(i) {
            $(this).html(buttonLabels[i]);
        });
        $("div.x-msgbox-bottom>div", imConfirm).removeClass("x-hide");

        msgBoxHandler(imConfirm, imMask);

        $("div.x-button", imConfirm).unbind('tap').bind('tap', function() {
            controllerGoBack("messageBox");

            if ($(this).is("div.x-button-action") && resultCallback && $.isFunction(resultCallback)) {
                resultCallback.call();
            }
        });
    }

    $.prompt = function(message, resultCallback, inputType, title, buttonLabels) {
        var imMask = new $.maskBox("messageBox"), imPrompt;
        inputType = inputType || "text";
        title = title || "Prompt";
        buttonLabels = buttonLabels ? $.typesOf(buttonLabels) === "string" ? buttonLabels.split(",") : buttonLabels : ["取消", "确定"];

        var inputIndex = { "text": 0, "password": 1, "tel": 2, "textarea": 3}[inputType];

        //todo 参数优化

        if (!$("div.x-msgbox")[0]) {
            imPrompt = createMsgBox(message, title);
        }
        else {
            imPrompt = $("div.x-msgbox").removeClass("x-hide");
            $("div.x-msgbox-title", imPrompt).html(title);
            $("div.x-msgbox-text", imPrompt).html(message);
        }

        $("span.x-button-label", imPrompt).each(function(i) {
            $(this).html(buttonLabels[i]);
        });
        $("div.x-msgbox-bottom>div, div.x-msgbox-inputs", imPrompt).removeClass("x-hide");
        var showInput = $("div.x-msgbox-inputs", imPrompt).children().val("").eq(inputIndex);
        showInput.removeClass("x-hide").siblings().addClass("x-hide");

        msgBoxHandler(imPrompt, imMask);

        $("div.x-button", imPrompt).unbind('tap').bind('tap', function() {
            controllerGoBack("messageBox");

            if ($(this).is("div.x-button-action") && resultCallback && $.isFunction(resultCallback)) {
                var inputReslut = showInput.val();
                resultCallback.call(null, inputReslut);
            }
        });
    }

    /*** msgBox End ***/

    /*** operation or data picker ***/

    var getCustomStyle = function(json) {
        var width = json.width,
        css = json.css,
        resultStyle = "style='";

        if ($.typesOf(width) === "string") {
            if (/(px|em)/.test(width)) {
                resultStyle += "width: " + width + ";";
            }
            else if (/\%/.test(width)) {
                resultStyle += "-webkit-box-flex: " + parseFloat(width) / (100 - parseFloat(width)) + ";";
            }
        }
        else if ($.typesOf(width) === "number") {
            resultStyle += "-webkit-box-flex: " + width + ";";
        }

        return resultStyle + (css ? css : "") + "'";
    }

    $.actionSheet = function(data) {
        if (!data || $.isEmptyObject(data) || !data.list || !data.list.length) {
            return;
        }

        var title = data.title || "",
            cancel = data.cancel || "Cancel",
            list = data.list,
            imActionSheet, html = [],
            imMask = new $.maskBox("actionSheet");

        if (!$("div.x-action-sheet")[0]) {
            html.push("<div id='im-action-sheet-" + controllerCount++ + "' class='x-action-sheet x-floating x-hide'><div class='x-sheet-title'>" + title + "</div><div class='x-sheet-body'><div class='x-sheet-content'>");
            for (var i = 0; i < list.length; i++) {
                html.push("<div class='x-button" + (list[i].highlight ? " x-button-decline" : " x-button-normal") + "'><span class='x-button-label'>" + list[i].value + "</span></div>");
            }
            html.push("</div><div class='x-button x-button-cancel'><span class='x-button-label'>" + cancel + "</span></div></div></div>");

            $(html.join("")).appendTo($(document.body));

            $("div.x-button-cancel").bind("tap", function() {
                controllerGoBack("actionSheet");
            });
        }
        else {
            imActionSheet = $("div.x-action-sheet");
            $("div.x-sheet-title", imActionSheet).html(title);
            for (var i = 0; i < list.length; i++) {
                html.push("<div class='x-button" + (list[i].highlight ? " x-button-decline" : " x-button-normal") + "'><span class='x-button-label'>" + list[i].value + "</span></div>");
            }
            $("div.x-sheet-content", imActionSheet).html(html.join(""));
        }

        imActionSheet = $("div.x-action-sheet");
        imActionSheet.removeClass("x-hide").css({ "top": getTopAndLeft(imActionSheet).top * 2 + "px", "WebkitTransform": "translate3d(0px,100%,0px)" });

        $("div.x-sheet-content div.x-button", imActionSheet).unbind("tap").each(function(i) {
            var action = list[i].action;
            if (action && $.isFunction(action)) {
                $(this).bind("tap", function() {
                    action.call(this);
                    controllerGoBack("actionSheet");
                });
            }
        });

        setControllerHash("actionSheet");

        $.controllerBack.actionSheet = function() {
            imActionSheet.transition({ "webkitTransform": "translate3d(0px,100%,0px)" }, function() {
                imActionSheet.addClass("x-hide").removeStyle("-webkit-transform");
                imMask.hide("actionSheet");
            });
        };

        setTimeout(function() {
            imActionSheet.transition({ "webkitTransform": "translate3d(0px,0%,0px)" }, function() {
                imActionSheet.removeStyle("-webkit-transform");
            });
        }, 10);

        $(window).resize(function() {
            if (!imActionSheet.hasClass("x-hide")) {
                imActionSheet.css("top", getTopAndLeft(imActionSheet).top * 2 + "px");
            }
        });
    }

    //picker

    var getPickerContent = function(data) {
        var html = [];

        for (var i = 0; i < data.length; i++) {
            var strStyle = data[i].width || data[i].css ? getCustomStyle(data[i]) : "";
            html.push("<div class='x-picker-component' " + strStyle + "><div class='x-picker-mask'><div class='x-picker-bar'></div></div>");
            html.push("<div class='x-scroller x-picker-slot'><div style='height: 80px;'></div>"); //x-scroller -> -webkit-box-flex: 1

            var pickerList = data[i].data;
            for (var j = 0; j < pickerList.length; j++) {
                html.push("<div class='x-picker-item'>" + pickerList[j] + "</div>");
            }
            html.push("<div style='height: 80px;'></div></div></div></div>");
        }

        return html.join("");
    }

    var createPicker = function() {
        var html = [], imPicker, pickerId = "im-picker-" + controllerCount++;

        html.push("<div id='" + pickerId + "' class='x-picker x-floating'><div class='x-picker-header'>"
                + "<div class='x-picker-header-inner'><div class='x-button x-button-cancel'><span class='x-button-label'>取消</span></div>"
                + "<div class='x-component'></div><div class='x-button x-button-action'><span class='x-button-label'>确定</span></div></div></div>"
                + "<div class='x-picker-content'><div class='x-picker-content-inner'></div></div></div>");

        $(html.join("")).appendTo($(document.body));

        imPicker = $("#" + pickerId);

        $(window).resize(function() {
            imPicker.css("top", getTopAndLeft(imPicker).top * 2 + "px");
        });

        return imPicker.css("top", getTopAndLeft(imPicker).top * 2 + "px").addClass("x-hide");
    }

    var bindPickerScroll = function(imPicker) {
        var scroller;
        var pickerItem, pickerItemMatrix, selectTop, clickTop, pickerItemScroller;
        var that, matrix, excessScroll, scrollHeight, selectIndex;

        $("div.x-scroller", imPicker).each(function() {
            scroller = $(this);

            scroller.scroll({ "vScrollbar": false,
                "onScrollEnd": function() {
                    that = $(this.wrapper);
                    matrix = new WebKitCSSMatrix(window.getComputedStyle($(">div", that)[0], null).webkitTransform);
                    excessScroll = -matrix.m42 % 45;
                    if (excessScroll) {
                        scrollHeight = excessScroll >= 22.5 ? matrix.m42 - (45 - excessScroll) : matrix.m42 + excessScroll;
                        selectIndex = -scrollHeight / 45;
                        that.scrollTo(scrollHeight, 500);
                    }
                    else {
                        selectIndex = -matrix.m42 / 45;
                    }
                    $("div.x-picker-item", that).removeClass("selected").eq(selectIndex).addClass("selected");
                }
            });

            $("div.x-picker-item", scroller).bind("tap", function() {
                pickerItem = $(this);
                pickerItemScroller = pickerItem.parents("div.x-scroller:first");
                if (!pickerItem.is(".selected")) {
                    selectTop = $("div.selected", pickerItemScroller).offset().top;
                    clickTop = pickerItem.offset().top;

                    pickerItemMatrix = new WebKitCSSMatrix(window.getComputedStyle($(">div", pickerItemScroller)[0], null).webkitTransform);
                    setTimeout(function() {
                        pickerItemScroller.scrollTo(clickTop > selectTop ? pickerItemMatrix.m42 - 45 : pickerItemMatrix.m42 + 45, 500);
                    }, 10);
                }
            }).eq(0).addClass("selected");
        });
    }

    $.picker = function(data, fn) {
        //防止出现因为没有使用new操作符来创建对象导致的bug
        if (!(this instanceof $.picker)) {
            return new $.picker(data, fn);
        }

        var imPicker;
        var params;
        var pickerId;
        var that = this;

        if (!data || $.typesOf(data) !== "array" || !data.length) {
            return;
        }

        if ($.typesOf(data[0]) !== "object") {
            data = [{ "data": data}]; //如果参数直接为一个数组的话，如[1,2,3]，将其转化成[{"data": [1,2,3]}]
        }

        that.picker = imPicker = createPicker();
        that.pickerId = imPicker.attr("id");

        $("div.x-picker-content-inner", imPicker).html(getPickerContent(data));

        bindPickerScroll(imPicker);

        $(".x-button-cancel, .x-button-action", imPicker).bind("tap", function() {
            if ($(this).is(".x-button-action")) {
                //在params中加入每个选项选中的index和总长
                params = [];
                $("div.selected", imPicker).each(function() {
                    params.push($(this).text());
                });
                if (fn && $.isFunction(fn)) {
                    that.params = params;
                    that.fn = fn;
                }
            }

            // to do 延时执行的整合
            setTimeout(function() {
                //上下执行顺序颠倒后运行会出现bug
                controllerGoBack(that.pickerId);
            }, 100);
        });
    }

    $.picker.prototype = {
        show: function(indexArray) {
            var that = this;
            var imPicker = that.picker;
            var pickerList, i, j, indexItem, pickerItemList, pickerItemLength, scrollLength;

            that.mask = new $.maskBox("picker");
            imPicker.css({ "WebkitTransform": "translate3d(0px,100%,0px)" }).removeClass("x-hide");

            if (indexArray || indexArray === 0) {
                if (!$.typesOf(indexArray, "array")) {
                    indexArray = [indexArray];
                }
                pickerList = $(".x-picker-component", imPicker);

                for (i = 0; i < pickerList.length; i++) {
                    scrollLength = 0;
                    indexItem = indexArray[i];
                    pickerItemList = $(".x-picker-item", pickerList.eq(i));
                    pickerItemLength = pickerItemList.length;

                    if (indexItem || indexItem === 0) {
                        if ($.typesOf(indexItem, "number")) {
                            indexItem = indexItem > pickerItemLength ? pickerItemLength : indexItem < 0 ? 0 : indexItem;
                            scrollLength = pickerItemList.eq(0).height() * indexItem;
                        }
                        else {
                            for (j = 0; j < pickerItemLength; j++) {
                                if (pickerItemList.eq(j).html() === indexItem) {
                                    scrollLength = pickerItemList.eq(0).height() * j;
                                    break;
                                }
                            }
                        }

                        pickerList.eq(i).refresh().scrollTo(-scrollLength, 0);
                    }
                }
            }

            setTimeout(function() {
                imPicker.transition({ "webkitTransform": "translate3d(0px,0%,0px)" }, function() {
                    imPicker.removeStyle("-webkit-transform");
                });
                scrollLength = null;
            }, 10);

            setControllerHash(imPicker.attr("id"));

            $.controllerBack[that.pickerId] = function() {
                that.hide();
            };
        },
        hide: function() {
            var that = this;
            var imPicker = that.picker;
            imPicker.transition({ "webkitTransform": "translate3d(0px,100%,0px)" }, function() {
                imPicker.addClass("x-hide").removeStyle("-webkit-transform");
                that.mask.hide("picker");
                if (that.fn && typeof that.fn === 'function') {
                    that.fn.call(null, that.params);
                }
            });
        },
        replace: function(data) {
            var imPicker = this.picker;

            if ($.typesOf(data[0]) !== "object") {
                data = [{ "data": data}]; //如果参数直接为一个数组的话，如[1,2,3]，将其转化成[{"data": [1,2,3]}]
            }
            $("div.x-picker-content-inner", imPicker).html(getPickerContent(data));
            bindPickerScroll(imPicker);

            return this;
        }
    }

    $.datePicker = function(fn) {
        //防止出现因为没有使用new操作符来创建对象导致的bug
        if (!(this instanceof $.datePicker)) {
            return new $.datePicker(fn);
        }

        var y = 1949, d = 1, i, paramsList = [];
        var year = new Date().getFullYear();
        var list = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; //month
        var picker;

        paramsList.push({ "data": list, width: 4, css: "text-align: right;" });

        list = [];
        for (i = d; i <= 31; i++) {
            list.push(i < 10 ? "0" + i : i); //date
        }
        paramsList.push({ "data": list, width: 1 });

        list = [];
        for (i = year; i >= y; i--) {
            list.push(i); //year
        }
        paramsList.push({ "data": list, width: 2 });

        picker = new $.picker(paramsList, function(params) {
            var resultDate = params[0] + " " + params[1].replace(/^0/, "") + ", " + params[2];
            if (fn && $.isFunction(fn)) {
                fn.call(null, resultDate);
            }
        });

        return picker;
    }

    /*** operation or data picker End ***/

    /*** Carousel ***/
    var currentCarousel;

    $.Carousel = $.carousel = function(container, direction, indicator) {
        if ($.isNotDOM(container)) {
            return;
        }
        container = container.jquery ? container : $(container);
        direction = direction || "horizontal"; //只有"horizontal"和"vertical"，默认为"horizontal"
        indicator = indicator || true;

        var children = $(">*", container);
        var isHorizontal = direction === "horizontal";
        var tranOpen = isHorizontal ? "translate3d(" : "translate3d(0,";
        var tranClose = isHorizontal ? "px,0,0)" : "px,0)";
        var cellLength = isHorizontal ? container.width() : container.height();
        var html = [];
        var matrix = [];

        children.each(function(i) {
            $(this).css({ "position": "absolute", "display": "block", "-webkit-transform": tranOpen + (i * cellLength) + tranClose });
            matrix.push(i * cellLength);
        });

        container.css({ "overflow": "hidden", "position": "relative" });

        if (indicator) {
            var indicatorCss = isHorizontal ? "x-carousel-indicator-horizontal" : "x-carousel-indicator-vertical"
            html.push('<div class="x-carousel-indicator ' + indicatorCss + '">');

            for (var i = 0; i < children.length; i++) {
                if (i == 0) {
                    html.push('<span class="x-carousel-indicator-active"></span>');
                }
                else {
                    html.push('<span></span>');
                }
            }
            html.push('</div>');

            container.append($(html.join("")));
        }

        var touchStart, touchEnd;

        container.bind(eventStart, function(e) {
            touchStart = touchEnd = $.getDragPos(e);
            currentCarousel = $(this);
            e.preventDefault();
        });
        container.bind(eventMove, function(e) {
            e.preventDefault();

            if (touchStart) {
                var current = $.getDragPos(e);
                var touchMove = isHorizontal ? (current.x - touchStart.x) : (current.y - touchStart.y);

                children.each(function(i) {
                    var that = $(this);
                    var imStop = matrix[i] + touchMove;
                    that.css({ "-webkit-transform": tranOpen + imStop + tranClose });
                });

                touchEnd = current;
            }
        });
        container.bind(eventEnd, function(e) {
            e.preventDefault();

            if (touchStart) {
                var touchMove = isHorizontal ? (touchStart.x - touchEnd.x) : (touchStart.y - touchEnd.y);
                var moveEnd = (m.abs(touchMove) < cellLength / 20 || touchMove < 0 && matrix[0] == 0 || touchMove > 0 && matrix[matrix.length - 1] == 0) && "0"
                        || touchMove > 0 && -cellLength
                        || touchMove < 0 && cellLength
                        || "0";

                children.each(function(i) {
                    var that = $(this);
                    var imStop = matrix[i] + Number(moveEnd);
                    that.transition({ "-webkit-transform": tranOpen + imStop + tranClose }, 300, "ease-out");

                    if (indicator && imStop == 0) {
                        $("div.x-carousel-indicator span", container).eq(i).addClass("x-carousel-indicator-active").siblings().removeClass("x-carousel-indicator-active");
                    }

                    matrix[i] = imStop;
                });
            }
            else {
                //解决不同Carousel拖动交叉时的效果优化
                if (currentCarousel) {
                    currentCarousel.trigger(eventEnd);
                    currentCarousel = undefined;
                }
            }
            touchStart = undefined;
            touchEnd = undefined;
        });

        $(window).resize(function() {
            var newCellLength = isHorizontal ? container.width() : container.height();
            for (var i = 0; i < matrix.length; i++) {
                matrix[i] = matrix[i] / cellLength * newCellLength;
                children.eq(i).css({ "-webkit-transform": tranOpen + matrix[i] + tranClose });
            }
            cellLength = newCellLength;
        });
    }

    /*** Carousel End ***/

    /*** Calendar ***/

    var weekNameList = ["一", "二", "三", "四", "五", "六", "日"];

    var getDateString = function(i) { //日期中的月份和日如果是一位的，则前面加个0
        return i > 9 ? i : "0" + i;
    }

    var getDateArray = function(y, m) { //获取当前这个月需要显示在日历中的日期的数组
        var firstDay = new Date(y, m, 1),
            nextFirstDay = new Date(y, m + 1, 1),
            lastDay = new Date(nextFirstDay.getTime() - 1000 * 60 * 60 * 24).getDate(),
            prevLastDay = new Date(firstDay.getTime() - 1000 * 60 * 60 * 24).getDate(),
            prevCount = firstDay.getDay() == 0 && 6 || firstDay.getDay() == 1 && 7 || firstDay.getDay() - 1,
            dataArray = [], i,
            prevMonth = m == 0 ? 12 : m,
            prevYear = y - 1 == 0 ? y - 1 : y,
            nextMonth = m + 2 == 13 ? 1 : m + 2,
            nextYear = y + 1 == 13 ? y + 1 : y;

        for (i = prevLastDay - prevCount + 1; i <= prevLastDay; i++) {
            dataArray.push(prevYear + "-" + getDateString(prevMonth) + "-" + i);
        }
        for (i = 1; i <= lastDay; i++) {
            dataArray.push(y + "-" + getDateString(m + 1) + "-" + getDateString(i));
        }
        var lenght = dataArray.length;
        for (i = lenght; i <= 42; i++) {
            dataArray.push(nextYear + "-" + getDateString(nextMonth) + "-" + getDateString(i - lenght + 1));
        }

        return dataArray;
    }

    //获取当天日期的string格式
    $.todayDate = _d.getFullYear() + "-" + getDateString(_d.getMonth() + 1) + "-" + getDateString(_d.getDate());

    // to do 性能优化及dataList的通用性优化
    $.Calendar = $.calendar = function(container, fn, dataList) {
        if ($.isNotDOM(container)) {
            return;
        }
        container = container.jquery ? container : $(container);
        if (fn && !dataList && $.typesOf(fn) === "object") {
            dataList = fn;
            fn = null;
        }

        var selectYear = _d.getFullYear(), //用于存储日历上当前选择的年份，默认为今天的年份
        selectMonth = _d.getMonth() + 1, //用于存储日历上当前选择的月份，默认为今天的月份
        selectDate = _d.getDate(), //用于存储日历上当前选择的日期，默认为今天的日期
        boolDay = false; //用于判断日历上的某一天是否是当月的日期

        //动态生成日历，放置在id为el的div内
        var html = [], content = "", i, j;

        html.push('<div id="im-calendar-' + controllerCount++ + '" class="x-calendar"><div class="x-calendar-head x-toolbar"><div class="x-calendar-head-title">'
                    + '<div class="x-calendar-head-title-prev"><div></div></div><div class="x-calendar-head-title-content">' + selectYear + '年 ' + selectMonth
                    + '月</div>' + '<div class="x-calendar-head-title-next"><div></div></div></div><div class="x-calendar-head-weekday">');

        for (i = 0; i < weekNameList.length; i++) {
            html.push('<div class="x-calendar-head-weekday-cell">' + weekNameList[i] + '</div>');
        }

        html.push('</div></div><div class="x-calendar-content x-list">');

        for (i = 0; i < 6; i++) {
            content += '<div class="x-list-item">';
            for (j = 0; j < 7; j++) {
                content += '<div class="x-list-item-body"><span></span><div></div></div>';
            }
            content += '</div>';
        }
        html.push('<div id="im-calendar-table-' + controllerCount++ + '" class="x-calendar-table current">' + content
                    + '</div><div id="im-calendar-table-' + controllerCount++ + '" class="x-calendar-table">' + content + '</div></div></div>');


        container.append($(html.join("")));

        var prev = $(".x-calendar-head-title-prev", container);
        var next = $(".x-calendar-head-title-next", container);

        $(".x-calendar-content", container).css("height", $(".x-calendar-table.current", container).height());

        var changeCalendarDate = function(event) { //日历中年份月份选择的改变，或者初始化的时候，进行日期和数据的绑定
            var inc;
            if (event) {
                inc = event.data.inc;
            }
            if (inc) {
                selectMonth += inc;
                if (selectMonth > 12 || selectMonth < 1) {
                    selectYear = selectYear + (selectMonth < 1 ? selectMonth - 1 : selectMonth) % 12;
                    selectMonth = selectMonth < 1 ? 12 : 1;
                }
                $(".x-calendar-head-title-content", container).html(selectYear + "年 " + selectMonth + "月");
            }
            var dateArray = getDateArray(selectYear, selectMonth - 1);
            CalendarShow(dateArray, inc); //绑定时间
            //Calendar.getJson(dateArray, Calendar.update); //绑定数据
            // delete dateArray;
            dataArray = undefined;
        };

        var CalendarShow = function(dateArray, inc) { //对日历表格中的每个td进行日期和样式的绑定
            var that, date, listItem;
            var toCalendar = inc ? $(".x-calendar-table:not(.current)", container) : $(".x-calendar-table.current", container);
            toCalendar.find(".x-list-item-body").each(function(i) {
                that = $(this);
                date = dateArray[i].substring(dateArray[i].lastIndexOf("-") + 1);
                that.removeClass("x-selected x-today x-disabled").data("date", dateArray[i]).find(">span").html(Number(date));

                listItem = dataList[dateArray[i]];
                that.find(">div").html($.isNoData(listItem) ? "" : "·");

                if (!checkDate(date)) {
                    that.addClass("x-disabled");
                }
                if (dateArray[i] == $.todayDate) {
                    that.addClass("x-today x-selected");
                }
            });
            delete dateArray;

            if (inc) {
                var fromCalendar = $(".x-calendar-table.current", container);
                prev.unbind("tap");
                next.unbind("tap");

                $.pageSlide(toCalendar, fromCalendar, inc < 0 ? true : false, function() {
                    fromCalendar.removeClass("current");

                    prev.bind("tap", { inc: -1 }, changeCalendarDate);
                    next.bind("tap", { inc: 1 }, changeCalendarDate);
                });
            }
        };

        var checkDate = function(arrDay) { //判断某个日期是否是当月的，因为日历中会显示当月日期和一部分的前一个月和后一个月的日期
            if (arrDay == 1) {
                boolDay = !boolDay;
            }
            return boolDay;
        };

        changeCalendarDate();

        prev.bind("tap", { inc: -1 }, changeCalendarDate);
        next.bind("tap", { inc: 1 }, changeCalendarDate);

        if (!isAndroid) {
            $(".x-calendar").bind("swipeLeft", { inc: 1 }, changeCalendarDate).bind("swipeRight", { inc: -1 }, changeCalendarDate);
        }

        var calenderCell = $(".x-list-item-body", container);
        calenderCell.bind("tap", function() {
            calenderCell.removeClass("x-selected");
            var dateData = $(this).addClass("x-selected").data("date");

            if (fn && $.isFunction(fn)) {
                fn.call(null, dateData);
            }
        });

        return {};
    }

    /*** Calendar End ***/

    /*** List ***/

    var CharacterList = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ");

    var getSortedDataList = function(settings, dataList) {
        var data = dataList ? dataList : settings.data;
        return settings.sort || settings.grouped ? $.sort(data, settings.sorters, settings.grouped, settings.direction.toLowerCase() === "desc" ? -1 : 1) : data;
    }

    var getListHtml = function(settings, dataList) {
        var html = [];
        var listContent = getListContent(settings, dataList);

        if (settings.grouped) {

            html.push('<div class="x-container"><h3 class="x-list-header x-list-header-swap x-hide"></h3><div id="im-sort-list-' + controllerCount++
                    + '" class="x-scroller x-list x-scroller-parent"><div class="x-list-parent">');

            html.push(listContent);

            html.push('</div></div>');

            if (settings.indexBar) {
                html.push('<div class="x-component x-indexbar x-indexbar-alphabet x-indexbar-vertical"><div class="x-indexbar-body">');
                $.each(CharacterList, function(i, name) {
                    html.push('<div class="x-indexbar-item" data-index="' + i + '">' + name + '</div>');
                });
                html.push('</div></div><div class="x-tips x-hide"></div>');
            }

            html.push('</div>');
        }
        else {
            html.push('<div id="im-sort-list-' + controllerCount++ + '" class="x-scroller x-list x-scroller-parent">');
            if (!$.isEmptyObject(settings.getNewerAjax)) {
                html.push('<div class="x-pull-down x-list-item"><div class="x-pull-icon"></div><div class="x-pull-label"><span class="js-pull-label">下拉可以刷新</span><br /><span class="js-pull-time">更新于</span></div></div>');
            }
            html.push('<div class="x-list-parent">');
            html.push(listContent);
            html.push('</div>');
            if (!$.isEmptyObject(settings.getOlderAjax)) {
                html.push('<div class="x-pull-up x-list-item"><div class="x-pull-label"><span class="x-pull-up-label">更多</span><span class="x-pull-icon x-hide"></span></div></div>');
            }
            html.push('</div>');
        }

        return html.join("");
    }

    var getListContent = function(settings, dataList) {
        var html = [];
        if (settings.grouped) {
            $.each(CharacterList, function(i, name) {
                if (dataList[name].length > 0) {
                    html.push('<div class="x-list-group" data-character="' + name + '"><h3 class="x-list-header">' + name + '</h3><div class="x-list-group-items">');
                    html.push(getListItemHtml(settings, dataList[name]));
                    html.push('</div></div>');
                }
            });
        }
        else {
            html.push(getListItemHtml(settings, dataList));
        }

        return html.join("");
    }

    var getListItemHtml = function(settings, dataList) {
        return $.setTemplete('<div class="x-list-item"><div class="x-list-item-body">' + settings.itemTpl
                     + '</div>' + (settings.arrows ? '<div class="x-list-arrows"></div>' : '') + '</div>', dataList);
    }

    var setListSize = function(container) {
        var scroller = $(".x-scroller", container);

        //获取整个容器的高度
        var containerHeight = container.height();

        //设置scroller的高度和宽度
        scroller.css({ "height": containerHeight + "px", "width": container.width() });

        //设置滚动容器的最小高度，便于滚动
        $(".x-list-parent", scroller).css("min-height", containerHeight);
    }

    var setTipsPosition = function(container) {
        var tips = $("div.x-tips", container);

        //获取字母块屏幕居中时top和left的位置信息
        var positionInfo = getTopAndLeft(tips, $(".x-scroller", container));

        //设置字母显示块的top和left，使其位于屏幕中央
        tips.css({ top: positionInfo.top, left: positionInfo.left });
    }

    //为排序或者分组的列表每行绑定其排序的属性，方便以后的添加行排序
    var setSortInfo = function(settings, container, dataList) {
        var listGroup;
        var listGroupData;
        var listItem;
        var that;
        var i;

        if (settings.grouped) {
            listGroup = $("div.x-list-group", container);

            listGroup.each(function() {
                that = $(this);
                listGroupData = dataList[that.data("character")];

                for (i = 0; i < listGroupData.length; i++) {
                    $("div.x-list-item", that).eq(i).data("sortInfo", settings.sorters ? listGroupData[i][settings.sorters] : listGroupData[i]);
                }
            })
        }
        else {
            listItem = $("div.x-list-item", container);

            for (i = 0; i < dataList.length; i++) {
                listItem.eq(i).data("sortInfo", settings.sorters ? dataList[i][settings.sorters] : dataList[i]);
            }
        }
    }

    var sortRule = function(a, b, direction) {
        direction = direction.toLowerCase() === "desc" ? -1 : 1;
        return direction >= 0 ? a.localeCompare(b) : b.localeCompare(a);
    }

    var bindListEvent = function(settings, container, obj) {
        var listItem;
        var listItemArray = obj ? obj : $("div.x-list-item", container);
        var dataTran;
        var a, p;

        //为列表的行绑定点击事件
        listItemArray.bind({
            "imStart": function() { $(this).addClass("x-item-pressed"); },
            "imMove": function() { $(this).removeClass("x-item-pressed"); },
            "imEnd": function() { $(this).removeClass("x-item-pressed"); },
            "tap": function() {
                listItem = $(this);
                if (listItem.hasClass("x-item-selected")) {
                    listItem.removeClass("x-item-selected");
                }
                else {
                    $("div.x-list-item.x-item-selected", container).removeClass("x-item-selected");
                    listItem.addClass("x-item-selected");
                }

                if (settings.dataTpl.href) {
                    dataTran = eval('(' + listItem.data("datatran") + ')');
                    a = $("<a></a>");
                    for (p in dataTran) {
                        a.attr("data-" + p, dataTran[p]);
                    }
                    a.appendTo('body').trigger('tapLink').remove();
                    a = null;
                }

                if (settings.tap && $.isFunction(settings.tap)) {
                    settings.tap.call(listItem);
                }
            },
            "taphold": function() {
                $(this).removeClass("x-item-pressed");
            }
        });

        //为列表的行绑定长按事件
        if (settings.taphold && $.isFunction(settings.taphold)) {
            listItemArray.bind("taphold", function() {
                settings.taphold.call($(this));
            });
        }
    }

    var bindIndexbarEvent = function(settings, container) {
        //获取屏幕中间显示的字母块
        var tips = $("div.x-tips", container);

        //获取字母导航栏
        var indexbar = $("div.x-indexbar", container);

        //获取所有的字母标签头
        var listHeader = $(".x-list-header-swap", container);

        //获取字母导航栏中的每一个字母
        var indexbarItem = $("div.x-indexbar-item", container);

        //获取字母导航栏中的每一个字母的高度
        var indexbarItemHeight

        //获取第一个导航栏字母的top
        var firstCharacterTop;

        //获取最后一个导航栏字母的top
        var lastCharacterTop;

        //获取整个容器的高度 to do window.resize
        var containerHeight = container.height();

        //整个滚动区域的高度
        var listTotalHeight;

        //导航选择的字母组
        var listGroupSelected;

        //导航选择的字母组的top
        var listGroupTop;

        //导航条点击下去时抓取到的节点
        var target;

        //获取当前手指移动到位置的Y轴坐标
        var currentPosition;

        //获取当前手指移动到位置的字母的序号
        var currentIndex;

        var hasTouchedIndexbar = false;

        //导航选择的字母后执行的导航到该字母组的函数
        var scrollToCharacter = function(character) {
            listGroupSelected = $("div.x-list-group[data-character=" + character + "]", container);

            if (!listTotalHeight) {
                listTotalHeight = $(".x-list-parent", container).height();
            }

            if (listGroupSelected.length) {
                listGroupTop = listGroupSelected[0].offsetTop;
                if (listGroupTop + containerHeight > listTotalHeight) {
                    listGroupTop = listTotalHeight - containerHeight;

                    //超出屏幕长度后，通过循环获取当前标签头所处的字母，而不是点哪个显示哪个
                    while (listGroupSelected[0].offsetTop > listGroupTop) {
                        listGroupSelected = listGroupSelected.prev();
                        character = listGroupSelected.data("character");
                    }
                }
                container.scrollTo(-listGroupTop, 0);

                if (listGroupTop == 0) {
                    listHeader.addClass("x-hide");
                }
                else {
                    listHeader.html(character).removeClass("x-hide");
                }
            }
        }

        //设置字母显示块的top和left，使其位于屏幕中央
        setTipsPosition(container);

        //导航条的事件绑定
        indexbar.bind(eventStart, function(e) {
            e.preventDefault();

            container.refresh(); //解决因创建时列表处于隐藏状态，导致的scroll的refresh失效

            target = $(e.target);

            if (target.hasClass("x-indexbar-item")) {
                tips.html(target.text());

                scrollToCharacter(target.text());
            }
            tips.removeClass("x-hide");
            $(this).addClass("x-indexbar-pressed");

            hasTouchedIndexbar = true;

        }).bind(eventMove, function(e) {
            e.preventDefault();

            if (!firstCharacterTop && !lastCharacterTop) {
                firstCharacterTop = indexbarItem.eq(0).offset().top;
                lastCharacterTop = indexbarItem.eq(-1).offset().top;
            }

            if ($.isTouchDown) {
                currentPosition = $.getDragPos(e).y;
                if (currentPosition >= firstCharacterTop && currentPosition <= lastCharacterTop) {
                    if (!indexbarItemHeight) {
                        indexbarItemHeight = indexbarItem.height();
                    }
                    currentIndex = parseInt((currentPosition - firstCharacterTop) / indexbarItemHeight);
                    tips.html(CharacterList[currentIndex]);

                    scrollToCharacter(CharacterList[currentIndex]);
                }
            }
        });

        $("body").bind(eventEnd, function() {
            if (indexbar.length && hasTouchedIndexbar) {
                indexbar.removeClass("x-indexbar-pressed");
                tips.html("").addClass("x-hide");

                hasTouchedIndexbar = false;
            }
        });
    }

    $.list = function(options) {

        //防止出现因为没有使用new操作符来创建对象导致的bug
        if (!(this instanceof $.list)) {
            return new $.list(options);
        }

        //判断如果传入参数为空，或者参数中的数据为空，或者列表容器不是dom
        if ($.isEmptyObject(options) || $.isNotDOM(options.container) || $.isEmptyObject(options.data)) {
            return;
        }

        //参数整合
        var settings = {
            container: null,
            data: null,
            sort: false,
            sorters: "",
            direction: "ASC",
            itemTpl: '<div>{$imAll}</div>',
            grouped: false,
            indexBar: false,
            arrows: false,
            tap: null,
            taphold: null,
            dataTpl: {}
        };

        $.extend(settings, options);

        //处理container，使之成为jquery的dom
        var container = $(settings.container);

        //排序后获取数据列表
        var dataList = getSortedDataList(settings);

        //创建dom时，用来存放dom字符串
        var html = getListHtml(settings, dataList);

        //用于本地缓存及实例返回值
        var listId;

        //拥有样式为x-scroller的dom
        var scroller;

        //获取列表滚动区域的容器dom
        var scrollContent;

        //滚动条滚动后执行的setInterval函数
        var timer;

        //获取所有的字母标签头
        var listHeader;

        //字母标签头的高度
        var listHeaderHeight;

        //字母组的字母标签头
        var groupListHeader;

        //列表字母组的top数组，用于滚动定位
        var listGroupTopArray = [];

        //列表所有字母组的容器
        var listGroup;

        //某个字母组的容器
        var listGroupItem,

        //滚动时的Y轴偏移
        translateY,

        //遍历字母组的容器
        i,

        //当前所处的字母组
        currentCharacter,

        //下一个字母组的top
        nextCharacterTop;

        //滚动条开始滚动时执行的函数，如果settings.grouped不为true的时候则为null
        var groudedListScrollStart = settings.grouped ? function() {
            if (!listHeaderHeight) { //编辑列表后可以修改listHeaderHeight = 0，使之进行重新取值

                //for safari, chrome正常，在safari中如果不加if (listHeaderHeight == 0) {} 则会出现标题头显示错误
                if (listHeaderHeight == 0) {
                    groupListHeader = $(".x-list-group .x-list-header", container);
                    listGroup = $("div.x-list-group", container);
                    listGroupTopArray = [];
                }

                //设置listHeaderHeight
                if (groupListHeader.length) {
                    listHeaderHeight = groupListHeader[0].offsetHeight;
                }

                //通过listGroup设置listGroupTopArray
                listGroup.each(function() {
                    listGroupItem = $(this);
                    listGroupTopArray.push({
                        character: listGroupItem.data("character"),
                        top: listGroupItem[0].offsetTop
                    });
                });
            }

            //创建定时器，判断滚动条当前位置，位于哪个字母组内部，设置字母标签头
            timer = setInterval(function() {
                translateY = -(new WebKitCSSMatrix(window.getComputedStyle(scrollContent.parent()[0], null).webkitTransform).m42);

                if (translateY > 0 && listGroupTopArray.length) {
                    listHeader.removeClass("x-hide");
                    for (i = 0; i < listGroupTopArray.length; i++) {
                        if (translateY < listGroupTopArray[i]["top"]) {
                            break;
                        }
                        currentCharacter = listGroupTopArray[i]["character"];
                        //加入listGroupTopArray.length的判断，避免i的溢出
                        nextCharacterTop = (i === listGroupTopArray.length - 1) ? scrollContent.height() : listGroupTopArray[i + 1]["top"];
                    }
                    listHeader.html(currentCharacter);

                    //不支持android
                    if (!isAndroid) {
                        if (nextCharacterTop - translateY < listHeaderHeight) {
                            listHeader.css("-webkit-transform", "translate3d(0px, " + (nextCharacterTop - translateY - listHeaderHeight) + "px, 0px)");
                        }
                        else {
                            listHeader.removeStyle("-webkit-transform");
                        }
                    }
                }
                else {
                    listHeader.addClass("x-hide");
                }
            }, 10);
        } : null;

        //滚动条结束滚动时执行的函数，清除定时器
        var groudedListScrollEnd = settings.grouped ? function() {
            clearInterval(timer);
            timer = null;
        } : null;

        //解决android中由于container没有id导致导航速度慢的bug
        if (isAndroid && !container.attr("id")) {
            container.attr("id", "im-list-container-" + controllerCount++);
        }

        //将新建的dom字符串合并，并放到容器中
        container.append(html);

        //为每行绑定上跳转所需的数据
        bindDataForTran(settings, dataList);

        scroller = $(".x-scroller", container);

        groupListHeader = $(".x-list-group .x-list-header", container);

        listHeader = $(".x-list-header-swap", container).html(groupListHeader.eq(0).html());

        scrollContent = $(".x-list-parent", scroller);

        listGroup = $("div.x-list-group", container);

        setListSize(container);


        //清理不必用的内存，将原数据列表放入本地存储，在list.add的时候可以使用
        listId = scroller.attr("id");
        settings.data = null;

        //为容器绑定滚动条
        container.scroll({
            vScrollbar: !settings.indexBar,
            onScrollStart: groudedListScrollStart,
            onScrollEnd: groudedListScrollEnd
        }); //先设定高度，再绑定滚动条

        //为列表的行绑定绑定事件
        bindListEvent(settings, container);

        //列表字母导航栏功能
        if (settings.grouped && settings.indexBar) {
            bindIndexbarEvent(settings, container);
        }

        if (settings.sort || settings.grouped) {
            setSortInfo(settings, container, dataList);
        }

        $(window).resize(function() {
            setListSize(container);
            if (settings.grouped && settings.indexBar) {
                setTipsPosition(container);
            }
        });

        return {
            id: listId,
            getListItem: function(i) {
                var listItemArray = $("div.x-list-item", container);
                return $.typesOf(i, "number") ? listItemArray.eq(i) : listItemArray;
            },

            replace: function(data) {
                if (!data || data.length === 0) {
                    return;
                }
                if (!$.typesOf(data, "array")) {
                    data = [data];
                }

                var sortedData = getSortedDataList(settings, data);
                var listContent = getListContent(settings, sortedData);

                container.scrollTo(0, 0);
                scrollContent.html(listContent);
                listHeaderHeight = 0;

                //为每行绑定上跳转所需的数据
                bindDataForTran(settings, sortedData);

                //为列表的行重新绑定绑定事件
                bindListEvent(settings, container);

                if (settings.sort || settings.grouped) {
                    setSortInfo(settings, container, sortedData);
                }
            },
            add: function(data) {
                if (!data || data.length === 0) {
                    return;
                }
                if (!$.typesOf(data, "array")) {
                    data = [data];
                }

                var listItemArray = $("div.x-list-item", container);
                var sortInfoItem = settings.sorters ? data[0][settings.sorters] : data[0];
                var listContent = $(getListItemHtml(settings, data)).data("sortInfo", sortInfoItem);
                var character = settings.sorters ? sortInfoItem.charAt(0).toUpperCase() : "";
                var listCharacterGroup;
                var listCharacterGroupItem;
                var that;
                var i;

                if (!settings.sort && !settings.grouped) {
                    scrollContent.append(listContent);
                }
                else if (settings.sort && !settings.grouped) {
                    for (i = 0; i < listItemArray.length; i++) {
                        that = listItemArray.eq(i);
                        if (!sortRule(sortInfoItem, that.data("sortInfo"), settings.direction)) {
                            that.before(listContent);
                            break;
                        }
                    }
                }
                else if (settings.grouped) {
                    listCharacterGroup = $("div.x-list-group[data-character=" + character + "]", container);

                    if (listCharacterGroup.length) {
                        listCharacterGroupItem = $("div.x-list-item", listCharacterGroup);
                        for (i = 0; i < listCharacterGroupItem.length; i++) {
                            that = listCharacterGroupItem.eq(i);
                            if (sortRule(sortInfoItem, that.data("sortInfo"), settings.direction) < 0) {
                                that.before(listContent);
                            }
                            else if (i == listCharacterGroupItem.length - 1) {
                                that.after(listContent);
                            }
                        }
                    }
                    else {
                        for (i = 0; i < listItemArray.length; i++) {
                            that = listItemArray.eq(i);
                            if (sortRule(sortInfoItem, that.data("sortInfo"), settings.direction) < 0) {
                                that.parents(".x-list-group:first").before('<div class="x-list-group" data-character="' + character
                                    + '"><h3 class="x-list-header">' + character + '</h3><div class="x-list-group-items"></div></div>');

                                $("div.x-list-group[data-character=" + character + "]", container).find(".x-list-group-items").append(listContent);

                                break;
                            }
                        }
                    }
                }

                listHeaderHeight = 0;
                bindDataForTran(settings, data, listContent);

                //为列表的行重新绑定绑定事件
                bindListEvent(settings, container, listContent);
            },
            //to do 批量操作
            remove: function(obj) {
                var removeItem = $(obj);
                if (settings.grouped && !removeItem.siblings().length) {
                    removeItem.parents(".x-list-group:first").remove();
                }
                else {
                    removeItem.remove();
                }
                listHeaderHeight = 0;
            },
            update: function(obj, data) {
                if (!data || data.length === 0) {
                    return;
                }
                if (!$.typesOf(data, "array")) {
                    data = [data];
                }

                var removeItem = $(obj);
                var listContent = getListItemHtml(settings, data);
                if (!settings.sort && !settings.grouped) {
                    removeItem.replaceWith(listContent);
                    bindDataForTran(settings, data, listContent);
                }
                else {
                    this.remove(obj);
                    this.add(data);
                }
            }
        };
    }

    //为每行绑定它的跳转信息，使用的是string格式的json数据
    var bindDataForTran = function(settings, dataList, obj) {
        var i;
        var groupData;
        var dataItem;
        var dataGroupItem;
        var listItemArray;

        if ($.isEmptyObject(settings.dataTpl)) {
            return;
        }

        if (!settings.grouped || obj) {
            listItemArray = obj ? obj : $("div.x-list-item", settings.container);
            for (i = 0; i < dataList.length; i++) {
                listItemArray.eq(i).data('datatran', getDataForTran(settings.dataTpl, dataList[i]));
            }
        }
        else {
            $.each(CharacterList, function(i, name) {
                groupData = dataList[name];
                if (groupData.length) {
                    dataGroupItem = $(".x-list-group[data-character=" + name + "] .x-list-item", settings.container);
                    for (i = 0; i < groupData.length; i++) {
                        dataGroupItem.eq(i).data('datatran', getDataForTran(settings.dataTpl, groupData[i]));
                    }
                }
            });
        }
    }

    //将json数据dataTpl变成string，然后通过模板加载函数，进行数据替换
    var getDataForTran = function(dataTpl, dataItem) {
        var dataStr = JSON.stringify(dataTpl);
        return $.setTemplete(dataStr, [dataItem]);
    }

    /*** List End ***/

    /*** PullRefresh ***/

    $.pullrefresh = function(options) {

        //防止出现因为没有使用new操作符来创建对象导致的bug
        if (!(this instanceof $.pullrefresh)) {
            return new $.pullrefresh(options);
        }

        //判断如果传入参数为空，或者参数中的数据为空，或者列表容器不是dom
        if ($.isEmptyObject(options) || $.isNotDOM(options.container) || $.isEmptyObject(options.data)) {
            return;
        }

        //参数整合
        var settings = {
            data: null,
            itemTpl: '<div>{$imAll}</div>',
            arrows: false,
            tap: null,
            taphold: null,
            dataTpl: {},

            //此处的两个用来存放获取最新数据，与获取旧数据的两个ajax的json参数，默认值如下
            /*{
            url: "",
            timeout: 0,
            data: null,
            success: null,
            error: null,
            complete: null,
            showLoading: false
            }
            */
            getNewerAjax: {},
            getOlderAjax: {}
        };

        $.extend(settings, options);

        //处理container，使之成为jquery的dom
        var container = $(settings.container);

        //排序后获取数据列表
        var dataList = getSortedDataList(settings);

        //创建dom时，用来存放dom字符串
        var html = getListHtml(settings, dataList);

        var hasPullDown = !$.isEmptyObject(settings.getNewerAjax);
        var hasPullUp = !$.isEmptyObject(settings.getOlderAjax);

        var pullDownEl, pullUpEl, pullDownOffset;

        var ajaxJson;

        var listScrollEnd = hasPullDown ? function() {
            if (pullDownEl.hasClass('flip')) {
                pullDownEl.removeClass('flip').addClass('loading');
                $('.js-pull-label', pullDownEl).html('加载中...');

                ajaxAction(container, settings);
            }
        } : null;

        var listScrollRefresh = hasPullDown || hasPullUp ? function() {
            if (hasPullDown && pullDownEl.hasClass('loading')) {
                pullDownEl.removeClass('loading');
                $('.js-pull-label', pullDownEl).html('下拉可以刷新');
            }
            if (hasPullUp && pullUpEl.hasClass("loading")) {
                pullUpEl.find(".x-pull-icon").addClass("x-hide").end().removeClass("loading");
            }

        } : null;

        var listScrollMove = hasPullDown ? function() {
            if (this.y > 5 && !pullDownEl.hasClass('flip') && !pullDownEl.hasClass('loading')) {
                pullDownEl.addClass('flip');
                $('.js-pull-label', pullDownEl).html('松开可以刷新');
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.hasClass('flip')) {
                pullDownEl.removeClass('flip');
                $('.js-pull-label', pullDownEl).html('下拉可以刷新');
                this.minScrollY = -pullDownOffset;
            }
        } : null;

        //将新建的dom字符串合并，并放到容器中
        container.append(html);
        setListSize(container);

        //为每行绑定上跳转所需的数据
        bindDataForTran(settings, dataList);

        if (hasPullDown) {
            pullDownEl = $(".x-pull-down", container);
            pullDownOffset = pullDownEl[0].offsetHeight;
        }

        if (hasPullUp) {
            pullUpEl = $(".x-pull-up", container);
            pullUpEl.bind("tap", function() {
                pullUpEl.addClass("x-item-pressed");
                setTimeout(function() {
                    pullUpEl.removeClass("x-item-pressed");
                }, 200);

                if (!pullUpEl.hasClass("loading")) {
                    pullUpEl.addClass("loading").find(".x-pull-icon").removeClass("x-hide");
                }

                ajaxAction(container, settings, true);
            });
        }

        container.scroll({
            useTransition: hasPullDown,
            topOffset: hasPullDown ? pullDownOffset : 0,
            onScrollEnd: listScrollEnd,
            onRefresh: listScrollRefresh,
            onScrollMove: listScrollMove
        }); //先设定高度，再绑定滚动条

        bindListEvent(settings, $('.x-list-parent', container));

        $(window).resize(function() {
            setListSize(container);
        });
    }

    var ajaxAction = function(container, settings, isBottom) {
        ajaxJson = isBottom ? settings.getOlderAjax : settings.getNewerAjax;
        if (ajaxJson.before && $.isFunction(ajaxJson.before)) {
            ajaxJson.before.call(null, settings.data);
        }

        $.sendRequest({
            url: ajaxJson.url,
            rootURL: ajaxJson.rootURL,
            timeout: ajaxJson.timeout,
            data: ajaxJson.data,
            success: function(data) {
                var listContent = $(getListItemHtml(settings, data));
                var firstItem = $('.x-list-parent .x-list-item:first', container);
                if (firstItem.length && !isBottom) {
                    firstItem.before(listContent);
                }
                else {
                    $('.x-list-parent', container).append(listContent);
                }

                bindDataForTran(settings, data, listContent);
                bindListEvent(settings, container, listContent);

                container.refresh();
                if (!isBottom) {
                    container.scrollTo(-$(".x-pull-down", container)[0].offsetHeight, 200);
                }

                if (ajaxJson.success && $.isFunction(ajaxJson.success)) {
                    ajaxJson.success.call(null, data);
                }
            },
            error: function(e) {
                if ($._conf.debugging) {
                    //for test
                    pullDownAction(container, settings, isBottom);
                }
                if (ajaxJson.error && $.isFunction(ajaxJson.error)) {
                    ajaxJson.error.call(null, e);
                }
            },
            complete: ajaxJson.complete,
            showLoading: false
        });
    }

    //for test
    var generatedCount = 0;
    var pullDownAction = function(container, settings, isBottom) {
        var dataTest = [];
        for (i = 0; i < 3; i++) {
            dataTest.push({ firstName: 'Generated row ', lastName: (++generatedCount) });
        }
        var listContent = $(getListItemHtml(settings, dataTest));
        var firstItem = $('.x-list-parent .x-list-item:first', container);
        if (firstItem.length && !isBottom) {
            firstItem.before(listContent);
        }
        else {
            $('.x-list-parent', container).append(listContent);
        }

        bindListEvent(settings, container, listContent);

        container.refresh();
        if (!isBottom) {
            container.scrollTo(-$(".x-pull-down", container)[0].offsetHeight, 200);
        }
    }

    /*** PullRefresh End ***/

    /*
    实例化后的控件方法
    */
    $.fn.extend({
        imSwitch: function(state, callback) {
            var body = $("body");
            var iswitch = $(this);
            var touchStartX, startX, endX, switchTouchTarget;
            var html;

            state = state || 'off';

            html = '<div data-switch="' + state + '" class="x-switch-container"><div class="x-switch" style="-webkit-transform: translateX(' + (state == "on" ? "0" : "-53px") + ')"></div>'
                       + '<img class="x-switch-mask" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAAAbCAMAAADCmciDAAAAP1BMVEX////8/f24uLiysrKwsLDCwsKxsbGsrKy9vb2oqKjFxcXExMS7u7u2tra5ubmnp6fBwcG/v7+0tLSurq6tra1p9N7gAAAAAXRSTlMAQObYZgAAAGhJREFUeF610McBBDEQhEB6pLXeXP6xXhRUADwgKSRLQiY0VyhE3c03BkSdDdGPFdFnz7kRjTyImpt/mREd7IiKE9FJIdo5EM28iB6amx8R3XREAx+ilR+izZ7TEBXdzedCM4VkQVLJH/uCAf2jknyhAAAAAElFTkSuQmCC" /></div>';

            // create the switch
            iswitch.each(function() {
                var that = $(this).html(html);
                var container = $(">div", that);
                var move = $(".x-switch", that);

                that.find(">div").attr("id", "im-switch-" + controllerCount++);

                // click handling
                move.bind("tap", function() {
                    if (!that.data("unabled")) {
                        state = container.data("switch").toLowerCase();
                        var position = state == 'on' ? "-53px" : "0";
                        var endType = state == 'on' ? "off" : "on";

                        move.transition({ "-webkit-transform": "translateX(" + position + ")" }, function() {
                            if (callback && $.isFunction(callback)) {
                                callback.call(null, endType);
                            }
                        });
                        container.data("switch", endType);
                    }
                });

                move.bind(eventStart, function(e) {
                    e.preventDefault();

                    switchTouchTarget = move;
                    touchStartX = $.getDragPos(e).x;
                    var matrix = new WebKitCSSMatrix(window.getComputedStyle(move[0], null).webkitTransform);
                    startX = matrix.m41;
                });

                move.bind(eventEnd, function(e) {
                    e.preventDefault();

                    if (endX && switchTouchTarget && switchTouchTarget.length) {
                        state = container.data("switch").toLowerCase();
                        var matrix = new WebKitCSSMatrix(window.getComputedStyle(switchTouchTarget[0], null).webkitTransform);
                        var position = matrix.m41 ? matrix.m41 : 0;
                        var endPosition = (state == "on" && position >= -5) || (state == "off" && position > -48) ? 0 : -53;
                        var endType = endPosition == 0 ? "on" : "off";

                        switchTouchTarget.transition({ "-webkit-transform": "translateX(" + endPosition + "px)" }, function() {
                            if (callback && $.isFunction(callback)) {
                                callback.call(null, endType);
                            }
                        });
                        switchTouchTarget.parent().data("switch", endType);
                        endX = 0;
                        delete switchTouchTarget;
                        switchTouchTarget = null;
                    }
                });
            });

            body.bind(eventMove, function(e) {
                e.preventDefault();

                if (switchTouchTarget && switchTouchTarget.length) {
                    if (!switchTouchTarget.data("unabled") && $.isTouchDown) {
                        e.preventDefault();

                        var currentX = $.getDragPos(e).x;
                        var moveX = currentX - touchStartX;
                        endX = startX + moveX;
                        if (endX <= 0 && endX >= -53) {
                            switchTouchTarget.css({ "-webkit-transform": "translateX(" + endX + "px)" });
                        }
                        else {
                            switchTouchTarget.css({ "-webkit-transform": "translateX(" + (endX < -53 ? -53 : 0) + "px)" });
                        }
                    }
                }
            });
            body.bind(eventEnd, function(e) {
                e.preventDefault();

                //解决tap事件后不触发body的eventEnd进行清除switchTouchTarget，导致的bug
                delete switchTouchTarget;
                switchTouchTarget = null;
            });

            return iswitch;
        },
        tabs: function(tabList, fn, style, pressedIndex) {
            if (!tabList || $.typesOf(tabList) === "funcion") {
                return;
            }

            container = this;
            tabList = $.typesOf(tabList) === "array" ? tabList : [tabList];
            var index = Number(style);

            if (!pressedIndex && (index || index == 0)) {
                pressedIndex = index;
                style = "";
            }

            var html = [];
            var currentIndex = isNaN(Number(pressedIndex)) ? -1 : Number(pressedIndex);

            html.push('<div id="im-tabs-' + controllerCount++ + '" class="x-container x-segmentedbutton" style="' + style + '"><div class="x-layout-box-inner x-layout-box">');

            for (var i = 0; i < tabList.length; i++) {
                html.push('<div id="im-tabs-button-' + controllerCount++ + '" class="x-tabs x-button x-button-normal' + (pressedIndex == i ? " x-button-pressed" : "") + '"><span class="x-button-label">' + tabList[i] + '</span></div>');
            }

            html.push("</div></div>");

            container.append($(html.join("")));
            var tabsButton = $("div.x-button", container);
            tabsButton.each(function(i) {
                var that = $(this);
                that.bind("tap", function() {
                    if (fn && $.isFunction(fn) && currentIndex != i) {
                        fn.call(null, i, currentIndex);
                        currentIndex = i;
                    }
                });
            });

            tabsButton.width(parseInt($("div.x-layout-box-inner", container).width() / 3));

            return container;
        }
    });

})(jQuery);