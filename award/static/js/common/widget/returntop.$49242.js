(function(){var b=b||"";Fx.Scroll=Fx.Scroll||new Class({Extends:Fx,options:{offset:{x:0,y:0},wheelStops:true},initialize:function(f,e){this.element=this.subject=document.id(f);this.parent(e);if(typeof(this.element)!="element"){this.element=document.id(this.element.getDocument().body)}if(this.options.wheelStops){var c=this.element,d=this.cancel.pass(false,this);this.addEvent("start",function(){c.addEvent("mousewheel",d)},true);this.addEvent("complete",function(){c.removeEvent("mousewheel",d)},true)}},set:function(){var c=Array.flatten(arguments);if(Browser.firefox){c=[Math.round(c[0]),Math.round(c[1])]}this.element.scrollTo(c[0],c[1])},compute:function(d,c,e){return[0,1].map(function(f){return Fx.compute(d[f],c[f],e)})},start:function(c,d){if(!this.check(c,d)){return this}var e=this.element.getScroll();return this.parent([e.x,e.y],[c,d])},calculateScroll:function(h,g){var e=this.element,c=e.getScrollSize(),i=e.getScroll(),k=e.getSize(),d=this.options.offset,j={x:h,y:g};for(var f in j){if(!j[f]&&j[f]!==0){j[f]=i[f]}if(typeof(j[f])!="number"){j[f]=c[f]-k[f]}j[f]+=d[f]}return[j.x,j.y]},toTop:function(){return this.start.apply(this,this.calculateScroll(false,0))}});function a(){this.el=new Element("div.return_top_wrapper");this.actionEl=new Element("a",{"class":"return_top_static",href:"javascript:void(0)",title:"返回顶部"});this.runningEl=new Element("a",{"class":"return_top_running",href:"javascript:void(0)"});this.bottomDistance=100;this.goTopTime=800;this.hideDistance=50;this.init()}a.prototype={init:function(){var c=this;new Element("div").inject(this.el);this.actionEl.inject(this.el);this.runningEl.inject(this.el);this.win=$(window);this.win.addEvent("domready",function(){c.el.inject(document.body);c.scrollEvent()});this.bindEvent()},bindEvent:function(){var c=this;var d=50;this.win.addEvent("scroll",function(){c.scrollEvent()});this.win.addEvent("resize",function(){c.resizeEvent()});this.el.addEvent("click",function(f){if(Browser.ie6){window.scrollTo(0,0);return}if(c.isRunning){return}c.startRunning();new Fx.Scroll(document.body).toTop();new Fx.Tween(c.el,{property:"top",duration:c.goTopTime,onComplete:function(){c.endRunning()}}).start("-"+parseInt(c.el.getStyle("height")));b&&b.push(["_trackEvent","主站右侧回到顶部","回到顶部按钮点击次数"]);f.stop()})},startRunning:function(){this.isRunning=true;this.actionEl.setStyle("left","-"+this.hideDistance+"px");this.runningEl.setStyle("left",0)},endRunning:function(){this.isRunning=false;this.runningEl.setStyle("left","-"+this.hideDistance+"px");this.actionEl.setStyle("left",0)},scrollEvent:function(){var c=parseInt(this.win.getScrollTop()),f=document.documentElement.clientHeight,d=f-parseInt(this.el.getStyle("height"))-this.bottomDistance;var e=this;if(e.isRunning){return}if(c>=f){if(Browser.ie6){this.el.setStyles({display:"block",top:c+d+"px"})}else{if(!this.hasShow){this.el.setStyles({top:f+"px",display:"block"});new Fx.Tween(this.el,{property:"top",duration:600}).start(d);this.hasShow=true}}}else{this.el.setStyle("display","none");this.hasShow=false}},resizeEvent:function(){var c=parseInt(this.win.getScrollTop()),e=document.documentElement.clientHeight,d=e-parseInt(this.el.getStyle("height"))-this.bottomDistance;if(c<e){return}this.el.setStyle("top",(Browser.ie6?c+d:d)+"px")}};YYT.returnTop=function(){if(Y.mobile.isSupport){return}new a()}})();