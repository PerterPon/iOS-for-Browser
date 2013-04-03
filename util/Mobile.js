(function(){
    
    var MobileUx = {
        
        platforms : [{
                property: 'platform',
                regex: /iPhone/i,
                identity: 'iPhone'
            },{
                property: 'platform',
                regex: /iPod/i,
                identity: 'iPod'
            },{
                property: 'userAgent',
                regex: /iPad/i,
                identity: 'iPad'
            },{
                property: 'userAgent',
                regex: /Blackberry/i,
                identity: 'Blackberry'
            },{
                property: 'userAgent',
                regex: /Android/i,
                identity: 'Android'
            },{
                property: 'platform',
                regex: /Mac/i,
                identity: 'Mac'
            },{
                property: 'platform',
                regex: /Win/i,
                identity: 'Windows'
            },{
                property: 'platform',
                regex: /Linux/i,
                identity: 'Linux'
        }],
        
        tests: [{
            identity: 'CSS3DTransform',
            fn : function() {
                return (typeof WebKitCSSMatrix != 'undefined' && new WebKitCSSMatrix().hasOwnProperty('m41'));
            }
        }],
        
        init: function(){
            this.checkTouch();
            this.initPropertyOnReady();
            this.initEventName();
            this.initMobileProperty();
            if($.support.touch){
                this.setupForMobile();
            }else{
                this.setupForPc();
            }
            this.platforms.splice(0);
            this.initPinch();
            this.initSwip();
            this.initRangeClick();
            this.initTranslate();
        },
        
        checkTouch : function(){
            $.support.touch = document.ontouchstart !== undefined ? true : false;
        },

        initSwip : function(){
            $.event.special.swipe = {
                scrollSupressionThreshold: 30, // More than this horizontal displacement, and we will suppress scrolling.

                durationThreshold: 500, // More time than this, and it isn't a swipe.

                horizontalDistanceThreshold: 10,  // Swipe horizontal displacement must be more than this.

                verticalDistanceThreshold: 75,  // Swipe vertical displacement must be less than this.

                setup: function() {
                    var thisObject = this,
                        $this = $( thisObject );

                    $this.bind( $.support.touchstart, function( event ) {
                        var data = event.originalEvent.touches ?
                                event.originalEvent.touches[ 0 ] : event,
                            start = {
                                time: ( new Date() ).getTime(),
                                coords: [ data.pageX, data.pageY ],
                                origin: $( event.target )
                            },
                            stop;

                        function moveHandler( event ) {

                            if ( !start ) {
                                return;
                            }

                            var data = event.originalEvent.touches ?
                                event.originalEvent.touches[ 0 ] : event;

                            stop = {
                                time: ( new Date() ).getTime(),
                                coords: [ data.pageX, data.pageY ]
                            };

                            // prevent scrolling
                            if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
                                event.preventDefault();
                            }
                        }

                        $this.bind( $.support.touchmove, moveHandler )
                            .one( $.support.touchstop, function( event ) {
                                $this.unbind( $.support.touchmove, moveHandler );

                                if ( start && stop ) {
                                    if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
                                        Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
                                        Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {

                                        start.origin.trigger( "swipe" )
                                            .trigger( start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight" );
                                    }
                                }
                                start = stop = undefined;
                            });
                    });
                }
            };
            $.each([ 'swipeleft', 'swiperight' ], function( index, value ){
                $.event.special[ value ] = $.event.special.swipe;
            });
        },

        initRangeClick: function(){
            $.event.special.rangeclick = {
                setup: function(){
                    var $this       = $(this);
                    var distance    = 5;
                    var timeMax     = 200;
                    var started, useTime, startX, startY;
                    function endFn(e){
                        started     = false;
                        useTime     = ((new Date()).getTime() - time);
                        var touches = e.originalEvent.changedTouches;
                        var touch   = touches ? touches[0] : e;
                        
                        if( Math.abs(startX - touch.pageX) <= distance && 
                            Math.abs(startY - touch.pageY) <= distance && 
                            useTime <= timeMax ){
                            var newEvent  = new $.Event(e.originalEvent, e);
                            newEvent.type = 'rangeclick';
                            $.event.trigger(newEvent, null, $this[0]);
                        }
                    }
                    $this.on($.support.touchstart,function(e){
                        var touches = e.originalEvent.touches;
                        if(started){
                            endFn(e);
                        }
                        var touch;
                        if(!touches || touches.length == 1){
                            touch   = touches ? touches[0] : e;
                            started = true;
                            time    = (new Date()).getTime();
                            startX  = touch.pageX;
                            startY  = touch.pageY;
                        }
                    });
                    $this.on($.support.touchstop, function(e){
                        if(started){
                            endFn(e);
                        }
                    });
                }
            };
        },

        initPinch: function(){
            $.each( "pinchstart pinch pinchend".split(" "), function(i, name) {
                $.fn[name] = function(fn) {
                    return fn ? this.bind(name, fn) : this.trigger(name);
                };
                $.attrFn[name] = true;
            });
            /**
             * add by ftt
             * Date:2011.12.12
             **/
            $.event.special.pinchstart = {
            
                pinchStarted : null,
                
                startDistance: null,
                
                lastTouches  : null,
                
                setup: function(){
                    if(!$.support.touch){
                        return false;
                    }
                    var $this = $(this);
                    $this.bind($.support.touchmove, function(event){
                        var originalEvent = event.originalEvent;
                        var touches     = originalEvent.touches;
                        var p           = $.event.special.pinchstart;
                        if(touches.length == 2){
                            firstPoint  = touches[0];
                            secondPoint = touches[1];
                            var start   = {
                                coords  : [ firstPoint.pageX, firstPoint.pageY ]
                            };
                            var end     = {
                                coords  : [ secondPoint.pageX,secondPoint.pageY]
                            };
                            var deltaX  = firstPoint.pageX - secondPoint.pageX;
                            var deltaY  = firstPoint.pageY - secondPoint.pageY;
                            var distance= Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                            if(!p.pinchStarted){
                                p.pinchStarted    = true;
                                p.startDistance   = distance;
                                
                                var newEvent      = $.Event("pinchstart");
                                newEvent.scale    = 1;
                                newEvent.distance = distance;
                                newEvent.vertDist = Math.abs(deltaY);
                                newEvent.horiDist = Math.abs(deltaY);
                                $this.trigger(newEvent);
                            }else{
                                var newEvent      = $.Event("pinch");
                                newEvent.scale    = distance / p.startDistance;
                                newEvent.distance = distance;
                                newEvent.vertDist = Math.abs(deltaY);
                                newEvent.horiDist = Math.abs(deltaY);
                                $this.trigger(newEvent);
                            }
                        }
                        p.lastTouches   = touches
                    });
                }
            }
        },
        
        initTranslate: function(){
            /*
             * 设置元素偏移
             */
            $.fn.translate = function(x, y){
                if(!this.length){
                    return;
                }
                x = (x ? (x + 'px') : 0);
                y = (y ? (y + 'px') : 0);
                this[0].style.webkitTransform = 'translate(' + x + ',' + y + ')';
            };
        },
        
        initPropertyOnReady: function(){
            var that          = this;
            $(function(){
                var doc       = document;
                var div       = doc.createElement('div');
                div.innerHTML = ['<div style="height:30px;width:50px;">', '<div style="height:20px;width:20px;"></div>', '</div>', '<div style="float:left; background-color:transparent;"></div>'].join('');
                doc.body.appendChild(div);
                for (i = 0, ln = that.tests.length; i < ln; i++){
                    test      = that.tests[i];
                    $.support[test.identity] = test.fn.call(this, doc, div);
                }
                doc.body.removeChild(div);
                that = div = doc = null;
            });
        },
        
        initMobileProperty: function(){
            var navigator = navigator || window.navigator;
            var is        = {};
            var platform, i, test;
            for (i = 0, ln = this.platforms.length; i < ln; i++) {
                platform  = this.platforms[i];
                is[platform.identity] = platform.regex.test(navigator[platform.property]);
            }
            is.Desktop    = is.Mac || is.Windows || (is.Linux && !is.Android);
            is.iOS        = is.iPhone || is.iPad || is.iPod;
            is.Standalone = !!navigator.standalone;
            i              = is.Android && (/Android\s(\d+\.\d+)/.exec(navigator.userAgent));
            if (i) {
                is.AndroidVersion      = i[1];
                is.AndroidMajorVersion = parseInt(i[1], 10);
            }
            is.Tablet     = is.iPad || (is.Android && is.AndroidMajorVersion === 3);
            is.Phone      = !is.Desktop && !is.Tablet;
            is.MultiTouch = !is.Blackberry && !is.Desktop && !(is.Android && is.AndroidVersion < 3);
            $.support.is  = is;
        },
        
        initEventName: function(){
            var supportTouch =  $.support.touch;
            $.extend($.support, {
                mousedown    : supportTouch ? "vmousedown"  : "mousedown",
                mouseup      : supportTouch ? "vmouseup"    : "mouseup",
                mouseout     : supportTouch ? "vmouseout"   : "mouseout",
                click        : supportTouch ? "vclick"      : "click",
                dblclick     : supportTouch ? "vdblclick"   : "dblclick",
                mousecancel  : supportTouch ? "vmousecancel": "mousecancel",
                touchstart   : supportTouch ? "touchstart"  : 'vtouchstart',
                touchstop    : supportTouch ? "touchend"    : 'vtouchend',
                touchmove    : supportTouch ? "touchmove"   : 'vtouchmove'
            });
        },
        
        initPropertyFn: function(){},
        
        setupForPc: function(){
            this.readyMousecancel();
            this.readyTouch();
        },
        
        setupForMobile: function(){
            this.readyVdblclick();
        },
        
        readyMousecancel: function(){
            $.event.special.mousecancel = {
                
                setup: function() {
                    var $this = $(this);
                    $this.bind('mousedown', function(event){
                        var startX = event.pageX;
                        var startY = event.pageY;
                        function handleCancel(){
                            clearHandler();
                            $this.trigger("mousecancel");
                        };
                        function clearHandler(){
                            $this.unbind('mousemove');
                            $this.unbind('mouseup');
                            $this.unbind('mouselevel');
                        };
                        $this.bind('mousemove', function(e){
                            var moveThreshold = $.vmouse.moveDistanceThreshold;
                            if ( Math.abs(e.pageX - startX) > moveThreshold || Math.abs(e.pageY - startY) > moveThreshold ) {
                                handleCancel();
                            }
                        });
                        $this.bind('mouseup',   clearHandler);
                        $this.bind('mouseleave',handleCancel);
                    });
                }
                
            };
        },
        
        readyTouch : function(){
            var targets    = [];
            var startEvent = false;
            var $curEl     = false;
            
            ['vtouchstart', 'vtouchmove', 'vtouchend'].forEach(function(type){
                $.event.special[type] = {
                    setup: function(){
                        var $this = $(this);
                        if( !$this.data('vt') ){
                            $this.data('vt', true);
                            targets.push($this);
                        }
                    }
                };
            });
            
            function trigger(type, event){
                if($curEl){
                    var newEvent  = new $.Event(event.originalEvent, event);
                    newEvent.type = type;
                    $.event.trigger(newEvent, null, $curEl[0]);
                }
            }
            
            function handleTouchStart(e){
                if(startEvent){
                    handleTouchEnd(e);
                }
                startEvent    = true;
                var target    = e.target;
                $curEl        = false;
                var len       = targets.length;
                var i;
                while(target){
                    for(i = 0; i < len; i++){
                        if( target === targets[i][0] ){
                            $curEl = targets[i];
                            break;
                        }
                    }
                    if($curEl){//防止事件重复触发
                        break;
                    }
                    target = target.parentNode;
                }
                trigger('vtouchstart', e);
                target     = null;
            }
            
            function handleTouchMove(e){
                if(!startEvent){
                    return;
                }
                if($curEl){
                    trigger('vtouchmove', e);
                }
            }
            
            function handleTouchEnd(e){
                if(!startEvent){
                    return;
                }
                if($curEl){
                    trigger('vtouchend', e);
                }
                $curEl     = false;
                startEvent = false;
            }
            $(document).
                bind( "mousedown", handleTouchStart).
				bind( "mousemove", handleTouchMove ).
                bind( "mouseup",   handleTouchEnd  );
        },
        
        readyVdblclick:function(){
            $.event.special.vdblclick = {
                setup: function() {
                    var $this = $(this);
                    $this.bind('vclick', function(e){
                        var t0 = $this.data('preClickTime');
                        var t1 = e.timeStamp;
                        if(!t0 || t1 - t0 >= 200){
                            t0 = t1;
                        }else{
                            $this.trigger('vdblclick');
                            t0 = null;
                        }
                        $this.data('preClickTime', t0);
                    });
                }
            }
        }
    };
    
    MobileUx.init();
    MobileUx = null;
    
})();