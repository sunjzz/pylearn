define(function(g,h,k){var j=j||"";var i=navigator.userAgent.indexOf("MSIE 6.0")!==-1;function l(){this.el=$("<div></div>").addClass("return_top_wrapper");this.actionEl=$("<a></a>").attr({href:"javascript:void(0)",title:"返回顶部"}).addClass("return_top_static");this.runningEl=$("<a></a>").attr({href:"javascript:void(0)"}).addClass("return_top_running");this.bottomDistance=100;this.goTopTime=800;this.hideDistance=50;this.init()}l.prototype={init:function(){var a=this;$("<div></div>").appendTo(this.el);this.actionEl.appendTo(this.el);this.runningEl.appendTo(this.el);this.win=$(window);$(document).ready(function(){a.el.appendTo(document.body);a.scrollEvent()});this.bindEvent()},bindEvent:function(){var a=this;var b=_.throttle(a.scrollEvent,400),c=_.throttle(a.resizeEvent,400);this.win.scroll(function(){b.call(a)});this.win.resize(function(){c.call(a)});this.el.click(function(d){if(a.isRunning){return}a.startRunning();$("html, body").animate({scrollTop:0},a.goTopTime);a.el.animate({top:"-"+a.el.innerHeight()},a.goTopTime,function(){a.endRunning()});j&&j.push(["_trackEvent","主站右侧回到顶部","回到顶部按钮点击次数"]);d.stopPropagation()})},startRunning:function(){this.isRunning=true;this.actionEl.css("left","-"+this.hideDistance+"px");this.runningEl.css("left",0)},endRunning:function(){this.isRunning=false;this.runningEl.css("left","-"+this.hideDistance+"px");this.actionEl.css("left",0)},scrollEvent:function(){var b=this.win.scrollTop(),c=document.documentElement.clientHeight,a=c-this.el.innerHeight()-this.bottomDistance;var d=this;if(d.isRunning){return}if(b>=c){if(i){this.el.show().css({top:b+a})}else{if(!this.hasShow){this.el.css({top:c}).show().animate({top:a},600);this.hasShow=true}}}else{this.el.hide();this.hasShow=false}},resizeEvent:function(){var b=this.win.scrollTop(),c=document.documentElement.clientHeight,a=c-this.el.innerHeight()-this.bottomDistance;if(b<c){return}this.el.css({top:i?b+a:a})}};k.exports=new l()});