//css3的东西

(function($) {
    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(), hasTouch = 'ontouchstart' in window,
        isAndroid = (/android/gi).test(navigator.appVersion), isApple = (/iphone|ipad/gi).test(navigator.appVersion),
        trnOpen = 'translate' + (has3d ? '3d(' : '('), trnClose = has3d ? ',0)' : ')', m = Math;

    var getBrowerCssInfo = function(json) {
        if ($.typesOf(json) === "object" && !$.isEmptyObject(json)) {
            var ua = navigator.userAgent.toLowerCase(),
            regBrower = /(webkit|gecko|presto|trident)/; ;

            var match = regBrower.exec(ua) || [];

            return json[match[1]];
        }
    }

    var cssPrdfix = getBrowerCssInfo({
        "trident": "",
        "webkit": "-webkit-",
        "gecko": "-moz-",
        "presto": "-o-"
    });

    var transitionEndEventName = getBrowerCssInfo({
        "trident": "",
        "webkit": "webkitTransitionEnd",
        "gecko": "transitionend",
        "presto": "oTransitionEnd"
    });

    $.fn.extend({
        removeStyle: function(cssList) {
            if ($.typesOf(cssList) === "string") {
                cssList = cssList.indexOf(",") != -1 ? cssList.split(",") : [cssList];
            }

            this.each(function() {
                for (var i = 0; i < cssList.length; i++) {
                    this.style.removeProperty($.trim(cssList[i])); //按照style名称去掉dom的style列表中的样式
                }
            })

            return this;
        },

        //to do 未来实现动画的暂停等功能，目前无法实现
        //-webkit-backface-visibility: hidden; 可以在动画时去除闪烁，但似乎跟google地图存在显示冲突，注意处理
        transition: function(props, speed, easing, fn) {
            var options = {
                cssEnd: {},
                property: "all",
                timinFunction: isApple ? "linear" : "ease-in-out",
                duration: "300ms",
                delay: 0,
                onTransitionEnd: fn || !fn && easing && $.isFunction(easing) && easing || $.isFunction(speed) && speed
            };

            if (!$.isEmptyObject(props)) {
                options.cssEnd = props;
            }
            else {
                return;
            }

            if ((speed || speed == 0) && !$.isFunction(speed)) {
                options.duration = $.typesOf(speed) === "number" ? (speed >= 10 ? speed + "ms" : speed + "s") : speed;
            }
            if (easing) {
                options.timinFunction = fn && easing || easing && !$.isFunction(easing) && easing;
            }

            var addCssText = cssPrdfix + "transition-duration:" + options.duration + ";" + cssPrdfix + "transition-property:" + options.property + ";" + cssPrdfix + "transition-timing-function:" + options.timinFunction + ";";

            this.each(function() {
                var that = $(this);

                var transitionEndHandler = function() {
                    that.unbind(transitionEndEventName);
                    //that[0].style.cssText = initialCssText;
                    that.removeStyle(cssPrdfix + "transition-duration," + cssPrdfix + "transition-property," + cssPrdfix + "transition-timing-function");

                    if (options.onTransitionEnd) {
                        options.onTransitionEnd.call(that); //todo
                        //options.onTransitionEnd.call();
                    }
                }

                that[0].style.cssText = that[0].style.cssText + addCssText;

                setTimeout(function() {
                    that.css(options.cssEnd).bind(transitionEndEventName, transitionEndHandler);
                }, 10);
            });

            //to do 目前没有太好的暂停动画的方法，可以用覆盖的形式处理平移等操作
            this.stop = function() {

            }

            return this;
        }
    });

    $.extend({
        pageNone: function(toPage, fromPage, toBack, fn) { //todo toPage === fromPage
            toPage.addClass("current");

            if (fn && $.typesOf(fn) == "function") {
                fn.call();
            }
        },
        pageSlide: function(toPage, fromPage, toBack, fn) { //todo toPage === fromPage
            var toStart = 'translateX(' + (toBack ? '-' : '') + '100%)';
            var fromEnd = 'translateX(' + (toBack ? '' : '-') + '100%)';
            toPage.css("webkitTransform", toStart).addClass("current").transition({ "-webkit-transform": "translateX(0%)" });

            fromPage.transition({ "-webkit-transform": fromEnd }, function() {
                fromPage.removeStyle("-webkit-transform");
                toPage.removeStyle("-webkit-transform");

                if (fn && $.typesOf(fn) == "function") {
                    fn.call();
                }
            });
        },
        pageSlideUp: function(toPage, fromPage, toBack, fn) { //todo toPage === fromPage
            var toStart = 'translateY(' + (toBack ? '-' : '') + '100%)';
            var fromEnd = 'translateY(' + (toBack ? '' : '-') + '100%)';

            if (toBack) {
                fromPage.transition({ "-webkit-transform": fromEnd }, function() {
                    fromPage.removeStyle("-webkit-transform");

                    if (fn && $.typesOf(fn) == "function") {
                        fn.call();
                    }
                });
                toPage.addClass("current");
            }
            else {
                toPage.css("webkitTransform", toStart).addClass("current").transition({ "-webkit-transform": "translateY(0%)" }, function() {
                    toPage.removeStyle("-webkit-transform");

                    if (fn && $.typesOf(fn) == "function") {
                        fn.call();
                    }
                });
            }
        },
        pagePop: function(toPage, fromPage, toBack, fn) {
            var toStart = fromEnd = 'scale(.5)';
            toPage.css("webkitTransform", toStart).addClass("current").transition({ "-webkit-transform": "scale(1)" });

            fromPage.transition({ "-webkit-transform": fromEnd, "opacity": "0" }, function() {
                fromPage.removeStyle("-webkit-transform,opacity");
                toPage.removeStyle("-webkit-transform");

                if (fn && $.typesOf(fn) == "function") {
                    fn.call();
                }
            });
        },
        pageFade: function(toPage, fromPage, toBack, fn) {
            toPage.addClass("current").css("zIndex", "0"); //注意背景不能为透明
            fromPage.transition({ "opacity": "0" }, function() {
                fromPage.removeStyle("opacity");
                toPage.removeStyle("z-index");

                if (fn && $.typesOf(fn) == "function") {
                    fn.call();
                }
            });
        },
        pageFlip: function(toPage, fromPage, toBack, fn) {
            if (has3d) {
                var body = $("body");
                var section = $("section");
                var tranRotate = 'rotateY(' + (toBack ? '' : '-') + '180deg)';

                body.css({ "-webkit-perspective": 1200 });
                fromPage.addClass("x-flip");
                toPage.addClass("x-flip").css({ "-webkit-transform": tranRotate }).addClass("current");

                //css文件中加入了x-flip, x-flip *的样式
                //    -webkit-backface-visibility: visible;
                //    -webkit-backface-visibility: hidden;
                //hidden在safari中可以正常使用，但是在chrome中有bug，需要在之前加入visible

                section.css({ "-webkit-transform-style": "preserve-3d" }).transition({ "-webkit-transform": tranRotate }, 500, function() {
                    fromPage.removeClass("x-flip");
                    toPage.removeClass("x-flip").removeStyle("-webkit-transform");
                    section.removeStyle("-webkit-transform,-webkit-transform-style");
                    body.removeStyle("-webkit-perspective");

                    if (fn && $.typesOf(fn) == "function") {
                        fn.call();
                    }
                });
            }
            else {
                this.pageSlide(toPage, fromPage, toBack, fn);
            }
        },
        pageCube: function(toPage, fromPage, toBack, fn) {
            if (has3d) {
                var section = $("section");
                var toStart = 'rotateY(' + (toBack ? '-' : '') + '90deg) translateZ(' + window.innerWidth + 'px)';
                var fromEnd = 'rotateY(' + (toBack ? '' : '-') + '90deg) translateZ(' + window.innerWidth + 'px)';
                var fromOrigin = toBack ? "left" : "right";
                var toOrigin = toBack ? "right" : "left";

                section.css({ "-webkit-perspective": 1200, "-webkit-transform-style": "preserve-3d" });
                fromPage.css({ "-webkit-transform-origin-x": fromOrigin }).transition({ "-webkit-transform": fromEnd });

                toPage.css({ "-webkit-transform-origin-x": toOrigin, "-webkit-transform": toStart }).addClass("current").transition({ "-webkit-transform": "rotateY(0deg) translateZ(0px)" }, 500, function() {
                    toPage.removeStyle("-webkit-transform,-webkit-transform-origin");
                    fromPage.removeStyle("-webkit-transform,-webkit-transform-origin");
                    section.removeStyle("-webkit-perspective,-webkit-transform-style");

                    if (fn && $.typesOf(fn) == "function") {
                        fn.call();
                    }
                });
            }
            else {
                this.pageSlide(toPage, fromPage, toBack, fn);
            }
        },
        pageSwap: function(toPage, fromPage, toBack, fn) {// to do animation方法的整合
            if (has3d) {
                var section = $("section");
                var animationCSS = toBack ? "swapright" : "swapleft"

                section.css({ "-webkit-perspective": 1200, "-webkit-transform-style": "preserve-3d" });

                var navigationEndHandler = function(e) {
                    fromPage.unbind('webkitAnimationEnd', navigationEndHandler);
                    fromPage.removeClass(animationCSS + ' out current');
                    toPage.removeClass(animationCSS + ' in');
                    section.removeStyle("-webkit-transform,-webkit-transform-style,-webkit-perspective");

                    if (fn && $.typesOf(fn) == "function") {
                        fn.call();
                    }
                };
                setTimeout(function() {
                    fromPage.addClass(animationCSS + ' out').bind('webkitAnimationEnd', navigationEndHandler);
                    toPage.addClass(animationCSS + ' in current');
                }, 10);
            }
            else {
                this.pageSlide(toPage, fromPage, toBack, fn);
            }
        }
    });

})(jQuery);