define(["require","exports","module","juicer","../tpl","modules/yinyuetai/pay","modules/yinyuetai/secret","dialog","alertify","user"],function(p,v,i){function o(){c.init()}var r=p("juicer"),d=p("../tpl"),u=p("modules/yinyuetai/pay"),l=p("modules/yinyuetai/secret"),a=p("dialog"),e=p("alertify"),s="http://stapi.yinyuetai.com/topic/bts/",h="http://stapi.yinyuetai.com/topic/bts/lottery/myrecords.json",f="http://s.yytcdn.com",t="http://img3.c.yinyuetai.com/others/crowd/170303/0/-M-4d208908aa2ddc2f0f38cb3271fbf3ba_0x0.png",n="http://img3.c.yinyuetai.com/others/crowd/170303/0/-M-1d86bca0e81fbca5a613b92058a9d278_0x0.png";user=p("user");var c={init:function(){var b=this;b.lotterGo(),b.WinRecord(),b.bindEvents(),b.userInfo()},ReWard:function(j,b,g){var k=this;$.ajax({url:"/award/get-prize",type:"get",dataType:"json",success:function(w){if(!w.error){c.drawPig=[];for(var q=0;q<w.items.length;q++){var m=w.items[q].img;w.items[q].id==b?c.index=q:c.drawPig.push(m)}k.lotterView(j,b,g)}}})},userInfo:function(){var j=this;if(user.isLogined()){j.getUserInfo()}else{var b=[];$(".userinfo-box").html(r(d.nologinTpl,b));var g="http://m.yinyuetai.com/login?redirect="+location.href;$(".login-btn").attr("href",g)}},getUserInfo:function(){$.ajax({url:"/award/get-user-info",type:"get",dataType:"json",success:function(b){b.error==0&&($(".userinfo-box").html(r(d.userwapInfotpl,b)),$(".hasUserinfo").val(1))}})},bindEvents:function(){var b=this;$(".userinfo-box").on("click",".mylottery",function(){user.isLogined()?$.ajax({url:"/award/get-luck",dataType:"json",data:{awardNum:2017},success:function(j){if(j.error!=0){return e.error(e.message),!1}var g=j.lucks.length;if(g==0){return e.error("您还没有中奖记录哦~"),!1}b.rewardRecord(),$(".reward-dialog").html(r(d.lotterywapRecordTpl,j)),$("body").css("overflow","hidden")}}):window.location.href="http://m.yinyuetai.com/login?redirect="+location.href})},rewardRecord:function(g){var b=new a(r(d.lotterywapRecordTpl,g),{width:"13.86666rem",height:"16.2133rem",isRemoveAfterHide:!0,draggable:!1,isAutoShow:!1,className:"reward-dialog"});b.on("show",function(){b.$el.on("click",".rewardclose",function(j){$("body").css("overflow","inherit"),b.hide()})}),b.show()},chargeVip:function(g){var b=new a(r(d.vipTpl,g),{width:550,height:280,isRemoveAfterHide:!0,draggable:!1,isAutoShow:!1,className:"vip-dialog"});b.on("show",function(){b.$el.on("click",".regvip",function(j){j.preventDefault(),user.login(function(){u.payVip({urlParameters:{appName:"awardVip"},hide:function(){b.remove()}})})}),$(".cancel").on("click",function(){b.hide()})}),b.show()},bindphoe:function(g){var b=new a(r(d.bindphoneTpl,g),{width:550,height:160,isRemoveAfterHide:!0,draggable:!1,isAutoShow:!1,className:"bind-dialog"});b.on("show",function(){$(".cancel").on("click",function(){b.hide()})}),b.show()},lotteryMarquee:function(){function q(){k.offset().top-w.offset().top<=0?w[0].scrollTop=0:w[0].scrollTop++}var j=50,w=$(".dynamic_box"),m=$(".info1"),k=$(".info2"),g=m[0].innerHTML;$(".info2").html(g);var b=setInterval(q,j);w.on("mouseover",function(){clearInterval(b)}),w.on("mouseout",function(){b=setInterval(q,j)})},lotterGo:function(){var g=this,b=$(window).height();$(".gray").height(b),user.isLogined()?$.ajax({url:s+"lottery/remain.json",dataType:"jsonp",data:{deviceinfo:'{"aid":"30001001"}'},success:function(j){var k=j.data.remain;$(".lottery-intro").html('您今天还有<span class="lottery-num">'+k+"</span>次机会")}}):$(".lottery-intro").css("visibility","hidden"),$(".lottery-li").on("click",function(){var k=$(".lottery-li").children("div:first-child").children("img").attr("src");if(k!=""){return}var j=$(this);user.isLogined()?($(".hasUserinfo").val()!=1&&g.getUserInfo(),g.lotterNum(j)):window.location.href="http://m.yinyuetai.com/login?redirect="+location.href})},lotterView:function(y,k,b){function x(){$(".lottery-li").children("div").removeClass("flipInY flipOutY"),$(".lottery-li").children("div:first-child").find("img").attr("src","")}var m=this,B=null,j=null,g=null,q=0,w=[];y.find("div:first-child img").attr("src",b),y.children("div:last-child").addClass("flipOutY"),y.children("div:first-child").addClass("flipInY");var A=y.siblings("li");m.lotterColection=c.drawPig;var z=m.lotterColection.sort(function(){return Math.random()-0.5});$.each(A,function(D,C){$(C).find("div:first-child img").attr("src",z[D])}),clearTimeout(B),clearTimeout(j),clearTimeout(g),B=setTimeout(function(){y.siblings("li").children("div:last-child").addClass("flipOutY"),y.siblings("li").children("div:first-child").addClass("flipInY"),j=setTimeout(function(){$(".lottery-li").children("div:last-child").addClass("flipInY"),$(".lottery-li").children("div:first-child").addClass("flipOutY"),g=setTimeout(x,800)},3000)},750)},lotterNum:function(g){var b=this;$.ajax({url:"/award/luck",dataType:"json",type:"post",data:l.des()}).done(function(j){if(j.error==1){return e.error(j.message),!1}var k=j.remainCount,m=j.image;b.ReWard(g,j.lotteryId,m),$(".leftnum").html('您今天还有 <span class="lnum">'+k+"</span> 次抽奖机会");if(j.type=="mark"){var k=parseInt($(".curfen .fennum").html())+j.num;$(".curfen .fennum").html(k)}})},WinRecord:function(){var b=this;$.ajax({url:"/award/get-luck-user",dataType:"json",data:{awardNum:2017},success:function(g){g.error==0?($(".info1").html(r(d.WinrecordTpl,g)),b.lotterySlider()):e.error(g.msg)}})},lotterySlider:function(){$(".info1 li").length>5&&setInterval(function(){$(".rewardlist").find("ul:first").animate({marginTop:"-20px"},300,function(){$(this).css({marginTop:"0px"}).find("li:first").appendTo(this)})},3000)}};return{init:o}});