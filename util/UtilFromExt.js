(function(){
    
    $.fn.transformOffset = function(){
        var transform = window.getComputedStyle(this[0]).webkitTransform,
            cssMatrix = transform != 'none' ? new WebKitCSSMatrix(transform) : new WebKitCSSMatrix();
    
        if (typeof cssMatrix.m41 != 'undefined') {
            return {
                x : cssMatrix.m41,
                y : cssMatrix.m42
            };
        } else if (typeof cssMatrix.d != 'undefined') {
            return {
                x : cssMatrix.d,
                y : cssMatrix.e
            };
        }else{
            return {
                x : 0,
                y : 0
            };
        }
    };
    
    $.constrain = function(number, min, max) {
        number = parseFloat(number);
        if (!isNaN(min)) {
            number = Math.max(number, min);
        }
        if (!isNaN(max)) {
            number = Math.min(number, max);
        }
        return number;
    };

    $.fn.pageBox = function(){
                
        var el = this[0],
            w  = el.offsetWidth,
            h  = el.offsetHeight,
            xy = this.offset(),
            t  = xy.top,
            r  = xy.left + w,
            b  = xy.top + h,
            l  = xy.left;
            
        return {
            left   : l,
            top    : t,
            width  : w,
            height : h,
            right  : r,
            bottom : b
        };
    };
    
    $.fn.translate = function(offset){
        if ($.support.CSS3DTransform) {
            this[0].style.webkitTransform = 'translate3d('+offset.x+'px, '+offset.y+'px, 0px)';
        } else {
            this[0].style.webkitTransform = 'translate('+offset.x+'px, '+offset.y+'px)';
        }
    };
    
    $.fn.getXY    = function(){
        var point = window.webkitConvertPointFromNodeToPage(this[0], new WebKitPoint(0, 0));
        return [point.x, point.y];
    };
    
    $.offsetUtil = function(x, y){
        return new OffsetUtil(x, y);
    };
    
    $.regionUtil = function(t, r, b, l){
        return new RegionUtil(t, r, b, l);
    };
    
    $.poitUtil   = function(x, y){
        return new PointUtil(x, y);
    };
    
    function OffsetUtil(x, y){
        this.x = (x != null && !isNaN(x)) ? x : 0;
        this.y = (y != null && !isNaN(y)) ? y : 0;
    };
    
    OffsetUtil.prototype  = {
        
        isOffsetUtil: true,
        
        copy: function() {
            return new OffsetUtil(this.x, this.y);
        },
    
        copyFrom: function(p) {
            this.x = p.x;
            this.y = p.y;
        },
    
        toString: function() {
            return "Offset[" + this.x + "," + this.y + "]";
        },
    
        equals: function(offset) {
            return (this.x == offset.x && this.y == offset.y);
        },
    
        round: function(to) {
            if (!isNaN(to)) {
                var factor = Math.pow(10, to);
                this.x = Math.round(this.x * factor) / factor;
                this.y = Math.round(this.y * factor) / factor;
            } else {
                this.x = Math.round(this.x);
                this.y = Math.round(this.y);
            }
        },
    
        isZero: function() {
            return this.x == 0 && this.y == 0;
        }
    };
    
    function RegionUtil(t, r, b, l){
        var me = this;
        me.top = t;
        me[1] = t;
        me.right = r;
        me.bottom = b;
        me.left = l;
        me[0] = l;
    }
    
    RegionUtil.prototype = {
        
        isRegionUtil: true,
    
        /**
         * Checks if this region completely contains the region that is passed in.
         * @param {RegionUtil} region
         */
        contains : function(region) {
            var me = this;
            return (region.left >= me.left &&
                    region.right <= me.right &&
                    region.top >= me.top &&
                    region.bottom <= me.bottom);
    
        },
    
        /**
         * Checks if this region intersects the region passed in.
         * @param {RegionUtil} region
         * @return {RegionUtil/Boolean} Returns the intersected region or false if there is no intersection.
         */
        intersect : function(region) {
            var me = this,
                t = Math.max(me.top,    region.top),
                r = Math.min(me.right,  region.right),
                b = Math.min(me.bottom, region.bottom),
                l = Math.max(me.left,   region.left);
    
            if (b > t && r > l) {
                return new RegionUtil(t, r, b, l);
            }
            else {
                return false;
            }
        },
    
        /**
         * Returns the smallest region that contains the current AND targetRegion.
         * @param {RegionUtil} region
         */
        union : function(region) {
            var me = this,
                t = Math.min(me.top, region.top),
                r = Math.max(me.right, region.right),
                b = Math.max(me.bottom, region.bottom),
                l = Math.min(me.left, region.left);
    
            return new RegionUtil(t, r, b, l);
        },
    
        /**
         * Modifies the current region to be constrained to the targetRegion.
         * @param {RegionUtil} targetRegion
         */
        constrainTo : function(r) {
            var me = this;
            me.top    = $.constrain(me.top,    r.top, r.bottom);
            me.bottom = $.constrain(me.bottom, r.top, r.bottom);
            me.left   = $.constrain(me.left,  r.left, r.right);
            me.right  = $.constrain(me.right, r.left, r.right);
            return me;
        },
    
        /**
         * Modifies the current region to be adjusted by offsets.
         * @param {Number} top top offset
         * @param {Number} right right offset
         * @param {Number} bottom bottom offset
         * @param {Number} left left offset
         */
        adjust : function(t, r, b, l) {
            var me = this;
            me.top += t;
            me.left += l;
            me.right += r;
            me.bottom += b;
            return me;
        },
    
        /**
         * Get the offset amount of a point outside the region
         * @param {String} axis optional
         * @param {Ext.util.Point} p the point
         * @return {OffsetUtil}
         */
        getOutOfBoundOffset: function(axis, p) {
            if (!Ext.isObject(axis)) {
                if (axis == 'x') {
                    return this.getOutOfBoundOffsetX(p);
                } else {
                    return this.getOutOfBoundOffsetY(p);
                }
            } else {
                p = axis;
                var d = new OffsetUtil();
                    d.x = this.getOutOfBoundOffsetX(p.x);
                    d.y = this.getOutOfBoundOffsetY(p.y);
                return d;
            }
    
        },
    
        /**
         * Get the offset amount on the x-axis
         * @param {Number} p the offset
         * @return {Number}
         */
        getOutOfBoundOffsetX: function(p) {
            if (p <= this.left) {
                return this.left - p;
            } else if (p >= this.right) {
                return this.right - p;
            }
    
            return 0;
        },
    
        /**
         * Get the offset amount on the y-axis
         * @param {Number} p the offset
         * @return {Number}
         */
        getOutOfBoundOffsetY: function(p) {
            if (p <= this.top) {
                return this.top - p;
            } else if (p >= this.bottom) {
                return this.bottom - p;
            }
    
            return 0;
        },
    
        /**
         * Check whether the point / offset is out of bound
         * @param {String} axis optional
         * @param {Ext.util.Point/Number} p the point / offset
         * @return {Boolean}
         */
        isOutOfBound: function(axis, p) {
            if (!Ext.isObject(axis)) {
                if (axis == 'x') {
                    return this.isOutOfBoundX(p);
                } else {
                    return this.isOutOfBoundY(p);
                }
            } else {
                p = axis;
                return (this.isOutOfBoundX(p.x) || this.isOutOfBoundY(p.y));
            }
        },
    
        /**
         * Check whether the offset is out of bound in the x-axis
         * @param {Number} p the offset
         * @return {Boolean}
         */
        isOutOfBoundX: function(p) {
            return (p < this.left || p > this.right);
        },
    
        /**
         * Check whether the offset is out of bound in the y-axis
         * @param {Number} p the offset
         * @return {Boolean}
         */
        isOutOfBoundY: function(p) {
            return (p < this.top || p > this.bottom);
        },
        
        getFactor: function(factor){
            return {
                x : Ext.isObject(factor) ? factor.x : factor,
                y : Ext.isObject(factor) ? factor.y : factor
            }
        },
    
        /*
         * Restrict a point within the region by a certain factor.
         * @param {String} axis Optional
         * @param {Ext.util.Point/OffsetUtil/Object} p
         * @param {Number} factor
         * @return {Ext.util.Point/OffsetUtil/Object/Number}
         */
        restrict: function(axis, p, factor) {
            if (Ext.isObject(axis)) {
                var newP;
    
                factor = p;
                p = axis;
    
                if (p.copy) {
                    newP = p.copy();
                }
                else {
                    newP = {
                        x: p.x,
                        y: p.y
                    };
                }
                factor = this.getFactor(factor);
                newP.x = this.restrictX(p.x, factor.x);
                newP.y = this.restrictY(p.y, factor.y);
                return newP;
            } else {
                factor = this.getFactor(factor);
                if (axis == 'x') {
                    return this.restrictX(p, factor.x);
                } else {
                    return this.restrictY(p, factor.y);
                }
            }
        },
    
        /*
         * Restrict an offset within the region by a certain factor, on the x-axis
         * @param {Number} p
         * @param {Number} factor The factor, optional, defaults to 1
         * @return
         */
        restrictX : function(p, factor) {
            if (!factor) {
                factor = 1;
            }
    
            if (p <= this.left) {
                p -= (p - this.left) * factor;
            }
            else if (p >= this.right) {
                p -= (p - this.right) * factor;
            }
            return p;
        },
    
        /*
         * Restrict an offset within the region by a certain factor, on the y-axis
         * @param {Number} p
         * @param {Number} factor The factor, optional, defaults to 1
         */
        restrictY : function(p, factor) {
            if (!factor) {
                factor = 1;
            }
    
            if (p <= this.top) {
                p -= (p - this.top) * factor;
            }
            else if (p >= this.bottom) {
                p -= (p - this.bottom) * factor;
            }
            return p;
        },
    
        /*
         * Get the width / height of this region
         * @return {Object} an object with width and height properties
         */
        getSize: function() {
            return {
                width: this.right - this.left,
                height: this.bottom - this.top
            };
        },
    
        /**
         * Copy a new instance
         * @return {RegionUtil}
         */
        copy: function() {
            return new RegionUtil(this.top, this.right, this.bottom, this.left);
        },
    
        /**
         * Dump this to an eye-friendly string, great for debugging
         * @return {String}
         */
        toString: function() {
            return "Region[" + this.top + "," + this.right + "," + this.bottom + "," + this.left + "]";
        },
    
    
        /**
         * Translate this region by the given offset amount
         * @param {OffsetUtil/Object} offset
         * @return {RegionUtil} this This Region
         */
        translateBy: function(offset) {
            this.left += offset.x;
            this.right += offset.x;
            this.top += offset.y;
            this.bottom += offset.y;
    
            return this;
        },
    
        /**
         * Round all the properties of this region
         * @return {RegionUtil} this This Region
         */
        round: function() {
            this.top = Math.round(this.top);
            this.right = Math.round(this.right);
            this.bottom = Math.round(this.bottom);
            this.left = Math.round(this.left);
    
            return this;
        },
    
        /**
         * Check whether this region is equivalent to the given region
         * @param {RegionUtil} region The region to compare with
         * @return {Boolean}
         */
        equals: function(region) {
            return (this.top == region.top && this.right == region.right && this.bottom == region.bottom && this.left == region.left)
        }
    };
    
    function PointUtil(x, y) {
        this.x = (x != null && !isNaN(x)) ? x : 0;
        this.y = (y != null && !isNaN(y)) ? y : 0;
    }
    
    PointUtil.prototype = {

        copy: function() {
            return new PointUtil(this.x, this.y);
        },

        copyFrom: function(p) {
            this.x = p.x;
            this.y = p.y;
    
            return this;
        },
        
        toString: function() {
            return "Point[" + this.x + "," + this.y + "]";
        },

        equals: function(p) {
            return (this.x == p.x && this.y == p.y);
        },

        isWithin: function(p, threshold) {
            if (!Ext.isObject(threshold)) {
                threshold = {x: threshold};
                threshold.y = threshold.x;
            }
    
            return (this.x <= p.x + threshold.x && this.x >= p.x - threshold.x &&
                    this.y <= p.y + threshold.y && this.y >= p.y - threshold.y);
        },

        translate: function(x, y) {
            if (x != null && !isNaN(x))
                this.x += x;
    
            if (y != null && !isNaN(y))
                this.y += y;
        },

        roundedEquals: function(p) {
            return (Math.round(this.x) == Math.round(p.x) && Math.round(this.y) == Math.round(p.y));
        }
    };
    
})();