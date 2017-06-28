function getShareTitle(){
    var titles=new Array()
    titles[0]="民生信用卡，616部iPhone7等你拿！"
    titles[1]="民生信用卡疯狂庆典，手机摇不停！"
    titles[2]="民生信用卡，好礼太多停不下来！"
    int i= Math.floor(Math.random()*3)
    if(titles[i]==undefined){
        return "民生信用卡12周年疯狂庆典";
    }else{
        return titles[i]
    }

}

function wxShare() {
            //shareTitle表示在朋友圈内显示时展现的图片,需替换为相应的的头图
            var imgUrl = "https://tp.creditcard.cmbc.com.cn/images/share_logo.png";
            //lineLink表示链接地址,需替换为相应的链接
            var lineLink = "https://tp.creditcard.cmbc.com.cn/index.html";
            var descContent = "民生信用卡616耍大牌，616部iPhone就等你来！";
            //shareTitle表示在朋友圈内显示时内容的描述,需替换为相应的描述
            var shareTitle =getShareTitle(); 
            var appid = "";

            var WxJssdk = {
                initData: null,
                init: function (initData) {
                    var link = location.href;
                    if (link.indexOf("#") > 0) {
                        link = link.split('#')[0];
                    }
                    var url = 'https://tp.creditcard.cmbc.com.cn/share-token?url=' + encodeURIComponent(link) + '&callback=WxJssdk.callback';
                    this.get(url);
                },
                get: function (url) {
                    var script = document.createElement("script");
                    script.src = url;
                    script.onload = function () {
                    }
                    document.getElementsByTagName("head")[0].appendChild(script);
                },
                callback: function (data) {
                    var flag_debug = false;//(location.href.indexOf("test")!==-1);

                    wx.config({
                        debug: flag_debug,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
                    });
                    wx.ready(function () {
                        WxJssdk.shareTimeline();
                        WxJssdk.shareAppMessage();
                        WxJssdk.shareQQ();
                        WxJssdk.shareQZone();
                    });
                },
                //分享到朋友圈
                shareTimeline: function () {
                    wx.onMenuShareTimeline({
                        title: shareTitle,
                        link: lineLink,
                        imgUrl: imgUrl,
                        success: function () {

                        },
                        cancel: function () {

                        }
                    });
                },
                //分享给好友
                shareAppMessage: function () {
                    wx.onMenuShareAppMessage({
                        title: shareTitle,
                        link: lineLink,
                        imgUrl: imgUrl,
                        desc: descContent,
                        success: function () {

                        },
                        cancel: function () {

                        }
                    });
                },
                //分享到QQ
                shareQQ: function () {
                    wx.onMenuShareQQ({
                        title: shareTitle,
                        link: lineLink,
                        imgUrl: imgUrl,
                        desc: descContent,
                        success: function () {
                        }
                    });
                },
                //分享到QQ空间
                shareQZone: function () {
                    wx.onMenuShareQZone({
                        title: shareTitle,
                        link: lineLink,
                        imgUrl: imgUrl,
                        desc: descContent,
                        success: function () {
                        }
                    });
                }
            };
            WxJssdk.init();
            window.WxJssdk = WxJssdk;
         }
