// JavaScript Document
$(function(){
	
var behavior = new cal_behavior();

sessionStorage.a = 0;
sessionStorage.b = null;

behavior.initButtons();
behavior.initBehavior();

$(".buttons").mousedown(function(){
	$(this).css("opacity","1");
}).mouseup(function(){
	$(this).css("opacity","0");
}).click(function(){
	behavior.changeFont();
});

function cal_behavior(){
	this.initBehavior = function() {
		$("#calculator-area").html(sessionStorage.a);
		behavior.changeFont();
		/*-----------------------运算符---------------------*/
		var ope = $("#operators > .buttons");
		ope.not("#operators > .buttons:last").not("#operators > .buttons:first").click(function(){
			var left = parseInt($(this).css("left")) - 5 + "px";
			var top = parseInt($(this).css("top")) - 6 + "px";
			$("#basicRing").css({"display":"block", "left": left, "top": top});
		});
		//"C"按钮
		$(ope[0]).click(function(){
			sessionStorage.a = 0;
			sessionStorage.b = null;
			if(sessionStorage.calculated) sessionStorage.removeItem("calculated");
			if(sessionStorage.calculate) sessionStorage.removeItem("calculate");
			if(sessionStorage.equalCal) sessionStorage.removeItem("euualCal");
			if(sessionStorage.c) sessionStorage.removeItem("c");
			if(sessionStorage.d) sessionStorage.removeItem("d");
			
			$("#calculator-area").html(sessionStorage.a);
		});
		$("#operators > .buttons:gt(1)").not(":last").click(function(){
			operator(this);
		});
		//"="按钮
		$(ope[6]).click(function(){
			if(sessionStorage.c) sessionStorage.d = sessionStorage.c;
			$("#basicRing").hide();
			if(sessionStorage.calculate) {
				sessionStorage.a = calculate(sessionStorage.calculate
					, parseFloat(sessionStorage.b), parseFloat(sessionStorage.a));
			} else if(sessionStorage.equalCal){
				sessionStorage.a = calculate(sessionStorage.equalCal
					, parseFloat($("#calculator-area").html()), parseFloat(sessionStorage.d));
					
			} else {
				//error
				sessionStorage.a = 0;
			};
			$("#calculator-area").html(sessionStorage.a);
			sessionStorage.b = null;
			if(sessionStorage.calculate) sessionStorage.equalCal = sessionStorage.calculate;
			sessionStorage.removeItem("calculate");
			sessionStorage.removeItem("c");	
			sessionStorage.calculated = true;	
		});
		function operator(el) {
			var cal = $(el).attr("name");
			if(sessionStorage.b == "null") {
				sessionStorage.b = sessionStorage.a;
			} else {	
				sessionStorage.b = calculate(cal, parseFloat(sessionStorage.b), parseFloat(sessionStorage.a));
			};
			sessionStorage.c = sessionStorage.a;
			$("#calculator-area").html(sessionStorage.b);
			sessionStorage.a = null;
			sessionStorage.calculate = cal;
		};
		function calculate(name, el1, el2){
			switch(name){
				case "divide":
					return el1 / el2;
					break;
				case "multiply":
					return el1 * el2;
					break;
				case "add":
					return el1 + el2;
					break;
				case "reduce":
					return el1 - el2;
					break;
			};
		};
		/*-----------------------数字-------------------------*/
		var num = $("#nums > .buttons");
		
		num_click(0, 7);
		num_click(1, 8);
		num_click(2, 9);
		num_click(3, 4);
		num_click(4, 5);
		num_click(5, 6);
		num_click(6, 1);
		num_click(7, 2);
		num_click(8, 3);
		num_click(9, 0);
		
		num.click(function() {
			if(sessionStorage.a.replace(/\,/g, "").length < 10) {
				$("#basicRing").hide();
				sessionStorage.a = behavior.addDot();
				$("#calculator-area").html(sessionStorage.a);
			};
		});
		function num_click(index, value) {
			$(num[index]).click(function(){
			if(sessionStorage.calculated == "true"){
				sessionStorage.a = 0;
				sessionStorage.calculated = false;
			}
			if(sessionStorage.a == 0 || sessionStorage.a == "null") {	
				sessionStorage.a = value;
			} else {
				sessionStorage.a = sessionStorage.a + "" + value;
			};
		});
		};
	};
	this.initButtons = function(){
		/*-----------------------------外围-----------------------*/
		for(var i = 0; i < 4; i++) {
			var left = (64 + 14) * i + "px";
			var top = "0px";
			var t_left = (64 + 14) * i + 11 + "px";
			var t_top = "102px";
			$($("#buttons > .buttons")[i]).css({"width":"64px","height":"39px", "left": left ,"top": top
				,"background-position":"-" + t_left + " -" + t_top});
		};
		/*---------------------------运算符------------------------*/
		for(var i = 0; i < 4; i++) {
			var left = (64 + 14) * i +"px";
			var top = "0px"
			var t_left = (64 + 14) * i + 11 + "px";
			var t_top = "163px";
			$($("#operators > .buttons")[i]).css({"width":"64px", "height":"39px", "left": left, "top": top
				,"background-position":"-" + t_left + " -" + t_top});
		};
		$($("#operators > .buttons")[4]).css({"width":"64px", "height":"39px", "left":"234px", "top":"61px"
			, "background-position":"-245px -224px"});
		$($("#operators > .buttons")[5]).css({"width":"64px", "height":"39px", "left":"234px", "top":"122px"
			, "background-position":"-245px -285px"});
		$($("#operators > .buttons")[6]).css({"width":"64px", "height":"100px", "left":"234px", "top":"183px"
			, "background-position":"-245px -346px"});
		/*----------------------------------数字---------------------*/
		var k = 0;
		for(var i = 0; i < 3; i++) {
			for(var j = 0; j < 3; j++) {
				var left = (64 + 14) * j + "px";
				var top = (39 + 22) * i + "px";
				var t_left = (64 + 14) * j + 11 + "px";
				var t_top = (39 + 22) * i + 224 + "px";
				$($("#nums > .buttons")[k++]).css({"width":"64px", "height":"39px", "left": left, "top": top
					, "background-position":"-" + t_left + " -" + t_top});	
			};
		};
		$($("#nums > .buttons")[9]).css({"width":"142px", "height":"39px", "left":"0px", "top":"183px"
			, "background-position":"-11px -407px"});
		$($("#nums > .buttons")[10]).css({"width":"64px", "height":"39px", "left":"156px", "top":"183px"
			, "background-position":"-167px -407px"});
	};
	this.addDot = function() {
		if(sessionStorage.a == "null") sessionStorage.a = 0;
		var num = sessionStorage.a.replace(/\,/g, "");
		var len = num.length;
		num.replace(/\,/g, "");
		
		if(len > 3 && len < 7) {
			num = num.substring(0, 1) + "," + num.substring(1);
		} else if(len > 6) {
			var num1 = num.substring(len - 3);
			var num2 = num.substring(len - 6, len - 3);
			var num3 = num.substring(len - 6, 0);
			var num = num3 + "," + num2 + "," + num1;
		};
		return num;
		
	};
	this.changeFont = function() {
		var num = $("#calculator-area").html().replace(/\,/g, "");
		var len = num.length;
		if(len > 6) {
			if(len > 9) {
				len = 8;
			}
			$("#calculator-area").css("fontSize", 70 - (len - 6) * 5 + "px");
		} else if(len < 7) {
			$("#calculator-area").css("fontSize", "70px");
		}
	};
};

});