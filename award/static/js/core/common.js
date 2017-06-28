/**
 * 初始化当前登录用户id
 */
var userId = 0;
var isPermanentUser = false;
var messageOverrides = "";
var isEmailVerified = false;//新增邮箱验证参数
//var messageOverrides = "因正在进行服务器维护，您刚才的操作未能成功";
/**
 * 初始化缓存对象
 */
var cache = {boxes: {}, popupLogins: {}};
/**
 * 所有全站搜索框的缺省提示文字
 */
var searchKeyHint = "从你感兴趣的开始...";
var urlStatic = urlStatic || "";
/**
 * 使用In.js按需加载所需模块并处理依赖关系
 * 有关In.js的详细信息请查阅In的文档
 */
In.add('form', {path: urlStatic + '/js/widget/ajaxForm.js?rev', type: 'js'});
In.add('humanmessage', {path: urlStatic + '/js/humanmessage.js?rev', type: 'js'});
In.add('mbox-css', {path: urlStatic + '/css/widget/mbox.css?rev', type: 'css'});
In.add('mbox', {path: urlStatic + '/js/widget/mbox.js?rev', type: 'js', rely: ['mbox-css']});
In.add('suggest-css', {path: urlStatic + '/css/widget/suggest.css?rev', type: 'css'});
In.add('suggest', {path: urlStatic + '/js/widget/suggest.js?rev', type: 'js', rely: ['suggest-css']});
In.add('overlay-css', {path: urlStatic + '/css/widget/overlay.css?rev', type: 'css'});
In.add('overlay', {path: urlStatic + '/js/widget/overlay.js?rev', type: 'js', rely: ['overlay-css']});
In.add('tips-css', {path: urlStatic + '/css/widget/tips.css?rev', type: 'css'});
In.add('tips', {path: urlStatic + '/js/widget/tips.js?rev', type: 'js', rely: ['tips-css']});

/**
 * 浮出层 mbox 的便捷函数封装
 * 用户不应当直接使用 MBox 对象，而应该使用这个封装中的函数
 */
var mbox = {
    /**
     * 根据指定标题、指定文本显示一个浮出层 mbox
     *
     * @param uniqueId   为当前页面中的这个浮出层起一个唯一的名字
     * @param title      浮出层标题
     * @param content    浮出层内容文字
     * @param boxOptions 浮出层的选项，以及事件
     *        常见选项包括
     *        1. width :        整数。宽度像素
     *        2. onInit:        函数。浮出层初始化后执行，函数有且只有一个缺省参数，为该浮出层 mbox 的实例
     * 本方法返回 MBox 的实例
     */
    show: function (uniqueId, title, content, boxOptions) {
        if (cache.boxes[uniqueId]) {
            cache.boxes[uniqueId].show();
            return cache.boxes[uniqueId];
        }
        var options = $extend(boxOptions, {title: title});
        In('mbox', function () {
            cache.boxes[uniqueId] = new MBox(content, options);
            cache.boxes[uniqueId].show();
        });
        return cache.boxes[uniqueId];
    },
    /**
     * 根据指定标题、指定的 Request Ajax调用，显示一个浮出层 mbox
     * 将Request调用后获得的文本作为该浮出层的内容文本
     *
     * @param uniqueId   为当前页面中的这个浮出层起一个唯一的名字
     * @param title      浮出层标题
     * @param request    Ajax远程调用， 必须为Request 的实例，建议设置好 url, method(可选，缺省为post), data(可选，缺省为空)
     * @param boxOptions 浮出层的选项，以及事件
     *        常用选项包括
     *        1. width : 宽度像素
     *        2. onInit: 浮出层初始化后腰执行的函数，函数有且只有一个缺省参数，为该浮出层 mbox 的实例
     * 本方法返回 MBox 的实例
     */
    showAjax: function (uniqueId, title, request, boxOptions) {
        if (cache.boxes[uniqueId]) {
            cache.boxes[uniqueId].show();
            return cache.boxes[uniqueId];
        }
        var options = $extend(boxOptions, {title: title});
        In('mbox', function () {
            cache.boxes[uniqueId] = new MBox(request, options);
            cache.boxes[uniqueId].show();
        });
        return cache.boxes[uniqueId];
    }
};
/**
 * Form 通过 Ajax 方式提交的便捷函数封装
 * 用户不应当直接使用 AjaxForm 对象，而应该使用这个封装中的函数
 */
var ajaxForm = {
    /**
     * 将一个 HTML Form 初始化为使用 ajax 方式提交，不刷新当前页面
     * @param form     HTML Form Element
     * @param options  选项以及事件
     *        常用选项包括
     *        1. onRequest : 函数，负责Form提交之前的客户端数据验证。函数!必须!返回 boolean 值，不能什么也不返回。
     *                       如果返回 false，则 Form 不会提交；如果返回 true，则以 Ajax 方式提交 Form
     *                       函数没有传入参数，但可以在函数中使用 this, this 指向待验证提交的 Form Element
     *        2. onComplete: 函数。用于 Form 提交完成后，处理服务器返回的 JSON 对象或文本
     *                       函数可以有两个传入参数： 1) responseJSON 服务器返回文本转换成的JSON对象
     *                                           2) responseText 服务器返回的文本(例如一个JSON形式编码的字符串)
     *        3. loginBeforeSubmit: 布尔值。如果为true，则要求用户试图提交之前，必须处于已登录状态，否则应弹出登录浮出层。
     *                              如果为 false 或不指定，则不要求用户处于已登录状态。
     */
    init: function (form, options) {
        In('form', function () {
            new AjaxForm(form, options);
        });
    }
};
/**
 * 弹出登录浮出层的便捷函数封装
 */
var login = {
    /**
     * 事先指定的函数数组，可以往里 push 任意数量的函数
     * 在登录成功之后会依次执行
     */
    callbacks: [],
    /**
     * 事先指定的函数数组，可以往里 push 任意数量的函数
     * 在登录ajax发出后返回userId=0时调用
     */
    notloginCallbacks: [],
    /**
     * 弹出登录浮出层
     * @param callback       函数，登录成功之后执行
     * @param optionOverrids 浮出层设置，常用设置如下
     *                       1. title : 设置浮出层的标题栏文字
     *                       2. width : 浮出层的宽度像素
     *                       3. overlay : 遮罩的设置（缺省为 0.3 透明黑底），如果不需要遮罩，可设置为 false
     */
    popupLogin: function (callback, optionOverrids) {
        if (userId) {
            callback();
            return false;
        }
        // 使得不同的 callback 和 optionOverrids 不会发生互相干扰
        var options = $merge({
            title: '<strong>登录环球冠品</strong>',
            width: 296,
            overlay: {
                "color": "#000",
                "opacity": "0.3"
            }
        }, optionOverrids);
        var uniqueId = ('popupLogin' + callback.toString() + options.toString()).toSHA1();
        cache.popupLogins[uniqueId] = cache.popupLogins[uniqueId] || false;
        if (cache.popupLogins[uniqueId]) {
            login.prepareCallback(callback, uniqueId);
            cache.popupLogins[uniqueId].show();
            return false;
        }
        In('mbox', 'form', function () {
            function makeLoginBox(content) {
                cache.popupLogins[uniqueId] = new MBox(content, {
                    title: options.title,
                    width: options.width,
                    overlay: options.overlay,
                    onInit: function (box) {
                        loginapi_js(box);
                        var form = box.getElement('form');
                        if (!form) {
                            return;
                        }
                        new AjaxForm(form, {
                            onComplete: function (action) {
                                if (action.error) {
                                    var login_error = box.getElement('[name=login_error]');
                                    login_error.setStyle('display', 'block');
                                    login_error.getElement('em').set('html', action.message);
                                    return false;
                                }
                                login.loginComplete(action);
                            }
                        });
                        if (Browser.Engine.trident) {
                            form.addEvent('keydown', function (event) {
                                if (event.key == "enter") {
                                    $(this).fireEvent('submit');
                                }
                            });
                        }
                        var initialHint = form['email'].value;
                        $(form['email']).addEvents({
                            'focus': function () {
                                this.getParent().addClass('focus');
                                if (this.get('value') == initialHint) {
                                    this.set('value', '');
                                }
                            },
                            'blur': function () {
                                this.getParent().removeClass('focus');
                                if (this.get('value').trim() == '') {
                                    this.set('value', initialHint);
                                }
                            }
                        });
                        $(form['password']).addEvents({
                            'focus': function () {
                                this.getParent().addClass('focus');
                            },
                            'blur': function () {
                                this.getParent().removeClass('focus');
                            }
                        });
                    },
                    onShow: function (box) {
                        var form = box.getElement('form');
                        if (!form) {
                            return;
                        }
                        form.getElement('input[name=email]').focus();
                    },
                    onHide: function (box) {
                        if (options.hideCallback) {
                            options.hideCallback();
                        }
                        var login_error = box.getElement('[name=login_error]');
                        login_error.setStyle('display', 'none');
                        var passwordInput = box.getElement('[name=password]');
                        passwordInput.value = "";
                    }
                });
            }

            new Request({
                url: '/ajax/login-form-new',
                method: 'post', // todo modify to 'get' after code freezed
                onSuccess: function (responseText) {
                    makeLoginBox(responseText);
                    login.prepareCallback(callback, uniqueId);
                    cache.popupLogins[uniqueId].show();
                }
            }).send();
        });
    },
    /**
     * (通常在页面加载完毕后)进行用户 Ajax 登录的操作
     * 登录完成后会依次执行 callbacks 中放置的函数
     */
    refreshLoginInfo: function () {
        new Request.JSON({
            url: '/login-info',
            onSuccess: function (result) {
                if (!result.error) {
                    login.loginComplete(result);
                }
            }.bind(this)
        }).send();
    },
    /* private */ loginComplete: function (action) {
        var callbackLength, i, callbackFunc;
        if (action.userId != 0) {
            userId = action.userId;
            if (action.isPermanentUser) {
                isPermanentUser = action.isPermanentUser;
            }
            isEmailVerified = action.isEmailVerified;
            if (login.callbacks && login.callbacks.length > 0) {
                callbackLength = login.callbacks.length;
                for (i = 0; i < callbackLength; i++) {
                    callbackFunc = login.callbacks.shift();
                    callbackFunc(action);
                }
            }
            if (login.callonceCallbacks && login.callonceCallbacks.length > 0) {
                callbackLength = login.callonceCallbacks.length;
                for (i = 0; i < callbackLength; i++) {
                    callbackFunc = login.callonceCallbacks.shift();
                    callbackFunc(action);
                }
            }
        } else {
            if (login.notloginCallbacks && login.notloginCallbacks.length > 0) {
                callbackLength = login.notloginCallbacks.length;
                for (i = 0; i < callbackLength; i++) {
                    callbackFunc = login.notloginCallbacks.shift();
                    callbackFunc();
                }
            }
        }
    },
    /* private */ logout: function () {

    },
    /* private */ prepareCallback: function (callback, uniqueId) {
        login.callonceCallbacks.empty();
        login.callonceCallbacks.push(function () {
            cache.popupLogins[uniqueId].hide();
        });
        if (callback) {
            login.callonceCallbacks.push(callback);
        }
    },
    /* private */ callonceCallbacks: []
};
/**
 * 为数组声明一个便捷方法
 */
Array.implement({
    /**
     * 使用指定的分隔符，将数组连接为字符串
     * 例如[12,'cat',34]，指定.为分隔符，会得到 '12.cat.34'
     * @param delimiter
     */
    explode: function (delimiter) {
        var output = "";
        this.each(function (item, index) {
            if (index > 0) {
                output += delimiter;
            }
            output += item.toString();
        });
        return output;
    }
});
(function () {
    var transforms = {
        'rotateLeft': function (a, b) {
            return (a << b) | (a >>> (32 - b));
        },
        'hex': function (a) {
            var b, c, result = '';

            for (b = 7; b >= 0; b--) {
                c = (a >>> (b * 4)) & 0x0f;
                result += c.toString(16);
            }

            return result;
        }
    };

    function utf8(string) {
        var a, b, result = '',
            from = String.fromCharCode;
        for (a = 0; b = string.charCodeAt(a); a++) {
            if (b < 128) {
                result += from(b);
            }
            else {
                if ((b > 127) && (b < 2048)) {
                    result += from((b >> 6) | 192);
                    result += from((b & 63) | 128);
                }
                else {
                    result += from((b >> 12) | 224);
                    result += from(((b >> 6) & 63) | 128);
                    result += from((b & 63) | 128);
                }
            }
        }
        return result;
    }

    function sha1(string) {
        var a, b, c,
            h1 = 0x67452301,
            h2 = 0xEFCDAB89,
            h3 = 0x98BADCFE,
            h4 = 0x10325476,
            h5 = 0xC3D2E1F0,
            t1, t2, t3, t4, t5;
        string = utf8(string);
        var length = string.length,
            words = new Array(),
            buffer = new Array(80),
            code = function (a) {
                return string.charCodeAt(a);
            },
            assign = function (c) {
                t5 = t4;
                t4 = t3;
                t3 = transforms.rotateLeft(t2, 30);
                t2 = t1;
                t1 = c
            };
        for (a = 0; a < length - 3; a += 4) {
            b = code(a) << 24 | code(a + 1) << 16 | code(a + 2) << 8 | code(a + 3);
            words.push(b);
        }
        switch (length % 4) {
            case 0:
                a = 0x080000000;
                break;
            case 1:
                a = code(length - 1) << 24 | 0x0800000;
                break;
            case 2:
                a = code(length - 2) << 24 | code(length - 1) << 16 | 0x08000;
                break;
            case 3:
                a = code(length - 3) << 24 | code(length - 2) << 16 | code(length - 1) << 8 | 0x80;
                break;
        }
        words.push(a);
        while ((words.length % 16) != 14) {
            words.push(0);
        }
        words.push(length >>> 29);
        words.push((length << 3) & 0x0ffffffff);
        for (c = 0; c < words.length; c += 16) {
            for (a = 0; a < 16; a++) {
                buffer[a] = words[c + a];
            }
            for (a = 16; a <= 79; a++) {
                buffer[a] = transforms.rotateLeft(buffer[a - 3] ^ buffer[a - 8] ^ buffer[a - 14] ^ buffer[a - 16], 1);
            }
            t1 = h1;
            t2 = h2;
            t3 = h3;
            t4 = h4;
            t5 = h5;
            for (a = 0; a <= 19; a++) {
                assign((transforms.rotateLeft(t1, 5) + ((t2 & t3) | (~t2 & t4)) + t5 + buffer[a] + 0x5A827999) & 0x0ffffffff);
            }
            for (a = 20; a <= 39; a++) {
                assign((transforms.rotateLeft(t1, 5) + (t2 ^ t3 ^ t4) + t5 + buffer[a] + 0x6ED9EBA1) & 0x0ffffffff);
            }
            for (a = 40; a <= 59; a++) {
                assign((transforms.rotateLeft(t1, 5) + ((t2 & t3) | (t2 & t4) | (t3 & t4)) + t5 + buffer[a] + 0x8F1BBCDC) & 0x0ffffffff);
            }
            for (a = 60; a <= 79; a++) {
                assign((transforms.rotateLeft(t1, 5) + (t2 ^ t3 ^ t4) + t5 + buffer[a] + 0xCA62C1D6) & 0x0ffffffff);
            }
            h1 = (h1 + t1) & 0x0ffffffff;
            h2 = (h2 + t2) & 0x0ffffffff;
            h3 = (h3 + t3) & 0x0ffffffff;
            h4 = (h4 + t4) & 0x0ffffffff;
            h5 = (h5 + t5) & 0x0ffffffff;
        }
        return (transforms.hex(h1) + transforms.hex(h2) + transforms.hex(h3) + transforms.hex(h4) + transforms.hex(h5)).toLowerCase();
    }

    String.implement({
        /**
         * 提供字符串的 utf8 形式
         * 用法： 'mystring'.toUTF8();
         */
        'toUTF8': function () {
            return utf8(this);
        },
        /**
         * 提供字符串的 sha1 散列值
         * 用法： 'mystring'.toSHA1();
         */
        'toSHA1': function () {
            return sha1(this);
        }
    });
})();
/**
 * 顶部状态栏（含登录处理）
 */
var topbar = {
    links: [
        {
            info: {
                "src": "",
                "className": "topBarAvatar",
                "text": "",
                "link": "#"
            },
            links: [
                {
                    "link": "/home/profile/avatar",
                    "className": "icon_avatar",
                    "text": "修改头像"
                },
                {
                    "link": "/home/profile",
                    "className": "icon_userInfo",
                    "text": "修改个人资料"
                },
                {
                    "link": "/home/profile/password",
                    "className": "icon_userPassword",
                    "text": "修改密码"
                }
            ]
        },
        {
            info: {
                "className": "icon_newMsg",
                "text": "",
                "link": "/home/message"
            },
            links: [
                {
                    "link": "/home/message",
                    "className": "icon_inbox",
                    "text": "收件箱"
                },
                {
                    "link": "/home/message/notification",
                    "className": "icon_information",
                    "text": "提醒"
                },
                {
                    "link": "/home/message/announcement",
                    "className": "icon_notice",
                    "text": "公告"
                }
            ]
        },
        {
            info: {
                "text": "我的",
                "link": "#"
            },
            links: [
                {
                    "link": "/u/",
                    "className": "icon_home",
                    "text": "<strong>我的展示页</strong>"
                },
                {
                    "link": "/home/blog/write",
                    "className": "icon_blog",
                    "text": "发表日志"
                },
                {
                    "link": "/home/album",
                    "className": "icon_photoUpload",
                    "text": "上传照片"
                },
                {
                    "link": "/home/fanclub",
                    "className": "icon_group",
                    "text": "我的饭团"
                },
                {
                    "link": "/home",
                    "className": "icon_yinyuetai",
                    "text": "<strong>我的环球冠品</strong>"
                },
                {
                    "link": "/home/mv",
                    "className": "icon_mv",
                    "text": "我的MV"
                },
                {
                    "link": "/home/pl",
                    "className": "icon_playlist",
                    "text": "我的悦单"
                },
                {
                    "link": "/home/friend",
                    "className": "icon_friend",
                    "text": "我的好友"
                }
            ]
        }
    ],
    toggleLoginForm: function () {
        var topBarLogin = $('topBarLogin');
        var topBarLoginA = topBarLogin.getElement('a');
        topBarLogin.hasClass('topBarLoginBtn') ? topBarLogin.removeClass('topBarLoginBtn') : topBarLogin.addClass('topBarLoginBtn');
        topBarLoginA.blur();
    },
    init: function () {
        loginapi_js($('topBarLogin'));
        var topBarLogin = $('topBarLogin');
        var topBarLoginA = topBarLogin.getElement('a[.topBarLoginPanelOpA]');
        topBarLoginA.removeEvents('click');
        topBarLoginA.addEvent('click', function () {
            this.toggleLoginForm();
            return false;
        }.bind(this));
        if ($('topBarProposal')) {
            $('topBarProposal').addEvent('click', function () {
                showAdviceDialog();
                return false;
            });
        }
        $$('#pop-username-top,#pop-password-top').each(function (item) {
            var val = item.get('value');
            item.addEvents({
                'focus': function () {
                    if (item.get('value') == val) {
                        item.set('value', '');
                    }
                    item.getParent().addClass('focus');
                },
                'blur': function () {
                    if (item.get('value') == val || !item.get('value')) {
                        item.getParent().removeClass('focus');
                        item.set('value', val);
                    }
                }
            });
        });
        $$('#topBarLoginForm input').each(function (item) {
            if (item.hasClass('i_text')) {
                item.addEvents({
                    'blur': function () {
                        if (item.get('value') == '') {
                            item.set('value', item.get('defaultValue'));
                            item.removeClass('focus');
                        }
                    },
                    'focus': function () {
                        if (item.get('value') == item.get('defaultValue')) {
                            item.set('value', '');
                        }
                    }
                });
            }
        });
        if (Browser.Engine.trident4) {
            $('topBarLoginSubmit').addEvents({
                'mouseover': function () {
                    this.className = 'hover';
                },
                'mouseout': function () {
                    this.className = '';
                }
            });
            topbar.fixIE6($$('#topBarUserPanel>ul>li'));
        }
        login.callbacks.push(function (action) {
            topbar.toggleLoginForm();
            topbar.links[0].info.src = action.headImg;
            if (Browser.Engine.trident) {
                topbar.links[0].info.text = (action.userName).substr(0, 4);
            } else {
                topbar.links[0].info.text = (action.userName).substr(0, 6);
            }
            topbar.links[0].info.link = '/home';
            topbar.links[1].info.text = action.messageSessionsInfo.totalUnreadCount;
            if (topbar.links[1].info.text) {
                topbar.links[1].info.src = '/images/core/new_msg.gif';
            }
            topbar.links[2].links[0].link = '/u/' + action.userId;
            if ($('topBarUserPanel')) {
                var ul = $('topBarUserPanel').getElement('ul');
                ul.innerHTML = topbar.makeHtml() + ul.innerHTML;
                topbar.fixIE6($$('#topBarUserPanel>ul>li'));
                $('topBarLogin').setStyle('display', 'none');
                $('topBarReg').setStyle('display', 'none');
                $('topBarLogined').setStyle('display', 'inline');
            }
        });
        ajaxForm.init($('topBarLoginForm'), {
            onRequest: function () {
                return true;
            },
            onComplete: function (action) {
                if (action.error) {
                    var login_error = $('login_error');
                    login_error.setStyle('display', 'block');
                    login_error.getElement('em').set('html', action.message);
                    return false;
                }
                login.loginComplete(action);
            }
        });
    },
    makeHtml: function () {
        var links = topbar.links;
        var html = '';
        for (var i = 0, len = links.length; i < len; i++) {
            var img = '';
            if (links[i].info.className) {
                var src = links[i].info.src || '/images/core/opacity.png';
                img = '<img src=" ' + src + ' " class=" ' + links[i].info.className + ' " alt=" ' + links[i].info.text + ' "/>';
            }
            html += '<li class="topBarUserPanelOption loginedOption">';
            html += '<a href="' + links[i].info.link + '" class="topBarUserPanelOptionA">' + img + '<em>' + links[i].info.text +
                '</em><img src="/images/core/opacity.png" alt="" class="icon_selectDown"/><!--[if lt IE 9]><span></span><![endif]--></a>';
            html += topbar.makeHtml2(links[i].links);
            html += '</li>';
        }
        return html;
    },
    makeHtml2: function (links) {
        var html = '<div class="topBarUserSelect"><!--[if lt IE 9]><span class="topBarUserSelectBgT"></span><![endif]--><ul>';
        for (var i = 0, len = links.length; i < len; i++) {
            html += '<li><a href="' + links[i].link + '"><img src="/images/core/opacity.png" class="' + links[i].className + '" alt=""/> ' +
                links[i].text + ' </a></li>'
        }
        html += '</ul><!--[if lt IE 9]><span class="topBarUserSelectBgB"></span><![endif]--></div>';
        return html;
    },
    fixIE6: function (list) {
        if (Browser.Engine.trident4) {
            list.each(function (item) {
                item.removeEvents('mouseenter');
                item.removeEvents('mouseleave');
                item.addEvents({
                    "mouseenter": function () {
                        item.addClass('hover');
                    },
                    "mouseleave": function () {
                        item.removeClass('hover');
                    }
                });
            });
        }
    }
};
/**
 * 在新窗口中对给定关键词进行全站搜索
 * @param keyword
 */
function doSearch(keyword) {
    var form = $('hidden_search_form');
    if (!form) {
        form = new Element('form', {
            'id': 'hidden_search_form',
            'action': '/search',
            'method': 'get',
            'target': '_blank',
            'styles': {
                'display': 'none'
            }
        });
        new Element('input', {
            type: 'hidden',
            name: 'keyword',
            value: keyword
        }).inject(form);
        form.inject(document.body);
    }
    form['keyword'].value = keyword;
    form.submit();
}
/**
 * 当在指定的一组元件(即：控制元件)上发生事件时，切换另一组元件(即：显示元件)的显示/隐藏状态
 * @param controls   控制元件的数组
 * @param elements   显示元件的数组
 * @param eventType  事件类型，例如 mouseenter, click 等，缺省为mouseenter
 */
function tabToggle(controls, elements, eventType) {
    eventType = eventType || 'mouseenter';
    controls.each(function (item, index) {
        if (item.hasClass('current')) {
            elements[index].setStyle('display', 'block');
        } else {
            elements[index].setStyle('display', 'none');
        }
        item.addEvent(eventType, function () {
            elements.setStyle('display', 'none');
            elements[index].setStyle('display', 'block');
            controls.removeClass('current');
            item.addClass('current');
            item.blur();
            return false;
        })
    })
}
/*
 * Flash加载函数
 * */
function checkFlash() {
    var hasFlash = 0;
    try {
        new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        hasFlash = 1;
    } catch (e) {
        if (navigator.plugins && navigator.plugins.length > 0 && navigator.plugins["Shockwave Flash"]) {
            hasFlash = 1;
        }
    }
    if (!hasFlash) {
        return "<p>您的浏览器不支持Flash,<a href='http://get.adobe.com/cn/flashplayer/' target='_target'>立即下载</a></p>";
    }
    return '';
}
//检查播放器版本，直播播放器必须用10.0以上
function getFlashVersion() {
    try {//ie6
        try {
            // avoid fp6 minor version lookup issues
            // see: deconcept » GetVariable/SetVariable crashes Internet Explorer with Flash Player 6
            var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
            try {
                axo.AllowScriptAccess = 'always';
            }
            catch (e) {
                return '6,0,0';
            }
        } catch (e) {
        }
        return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g,
            ',').match(/^,?(.+),?$/)[1];
        // other browsers
    } catch (e) {
        try {
            if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
                return (navigator.plugins["Shockwave Flash 2.0"] ||
                navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g,
                    ",").match(/^,?(.+),?$/)[1];
            }
        } catch (e) {
        }
    }
    return '0,0,0';
}
//增加版本需求
function checkFlashVersion(version) {
    return '';
}

function loadFlash(url, boxId, id, width, height, flashvars, write, options) {
    var flashCode;
    var checkResult = checkFlash();
    if (checkResult != '') {
        flashCode = checkResult;
        documentWrite(write, boxId, flashCode);
        return;
    }
    if (options && options.version) {
        checkResult = checkFlashVersion(options.version);
        if (checkResult != '') {
            flashCode = checkResult;
            documentWrite(write, boxId, flashCode);
            return;
        }
    }
    id = id || 'flashplayer';
    width = width || '100%';
    height = height || '100%';
    flashvars = flashvars || '';
    var wmd = 'window';
    var bgColor = '#000000';
    if (options) {
        wmd = options['wmode'] || 'window';
        bgColor = options['bgColor'] || '#000000';
    }
    if (Browser.Engine.trident) {
        flashCode = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' +
            'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" ' +
            'width="' + width + '" height="' + height + '" id="' + id + '" name="' + id + '">' +
            '<param name="allowScriptAccess" value="always" />' +
            '<param name="allowFullScreen" value="true" />' +
            '<param name="movie" value="' + url + '" />' +
            '<param name="loop" value="true" />' +
            '<param name="menu" value="false" />' +
            '<param name="wmode" value=' + wmd + ' />' +
            '<param name="quality" value="high" />' +
            '<param name="bgcolor" value=' + bgColor + ' />' +
            '<param name="flashvars" value="' + flashvars + '" />' +
            '</object>';
    } else {
        flashCode =
            '<embed  pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="' + width +
            '" height="' + height + '" flashvars="' +
            flashvars +
            '" bgcolor="' + bgColor + '" allowfullscreen="true" allowscriptaccess="always" wmode="' + wmd + '" id="' + id +
            '" name="' +
            id +
            '" src="' + url + '" />';
    }
    documentWrite(write, boxId, flashCode);
}

function documentWrite(write, boxId, flashCode) {
    if (write) {
        document.write(flashCode);
    } else {
        window.addEvent('domready', function () {
            $(boxId).set('html', flashCode);
        });
    }
}
function addBookmark(url, title) {
    try {
        window.external.AddFavorite(url, title);
        return false;
    } catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
            return false;
        } catch (err) {
            //alert('暂不支持此浏览器');
            return false;
        }
    }
}
function setHomepage() {
    try {
        document.body.style.behavior = 'url(#default#homepage)';
        document.body.setHomePage('http://www.tinyspace.com');
    } catch (e) {
        alert("暂不支持此浏览器");
    }
}

/*判断ipad、iphone,wphone*/
var mobile = {};
mobile.init = function () {
    mobile.d = navigator.userAgent.toLowerCase();
    mobile.android = /android/.test(mobile.d);
    mobile.ipod = /ipod\;/.test(mobile.d);
    mobile.iphone = /iphone os/.test(mobile.d);
    mobile.realIpad = /ipad/.test(mobile.d);
    mobile.wphone = /windows phone os/.test(mobile.d);
    mobile.ipad = mobile.realIpad || mobile.iphone;
};

/*
 * 提示信息封装
 * */
function showMessage(msg, type) {
    In('humanmessage', function () {
        window[type + 'Message'](msg);
    });
}

/**
 * 公用的页面加载后执行的内容
 */
window.addEvent('domready', function () {
    mobile.init();
    // 初始化顶部工具栏
    if ($('topBarLogin')) {
        topbar.init();
    }
    // 初始化所有的全站搜索框
    $$('form').each(function (form) {
        if (!form.action.match(/(http:\/\/[^/]+)?\/search($|\/)/ig)) {
            return;
        }
        form.method = 'get';
        form.addEvent('submit', function () {
            var searchKey = this["keyword"].value.trim();
            if (searchKey == searchKeyHint) {
                this["keyword"].value = "";
            }
            return true;
        });
        var input = $(form['keyword']);
        if (input) {
            input.setAttribute('autocomplete', 'off');
            if (Browser.Engine.trident) {
                if (input.value.trim().length == '') {
                    input.value = searchKeyHint;
                    input.addClass('placeholder');
                }
                input.addEvents({
                    'focus': function () {
                        if (this.value == searchKeyHint) {
                            this.value = "";
                        }
                        this.removeClass('placeholder');
                    }, 'blur': function () {
                        if (this.value == "") {
                            this.value = searchKeyHint;
                        }
                        this.addClass('placeholder');
                    }
                });
            }
            if (form.get('name') == 'searchForm') {
                initSearchType(input);
                var maxResults = 10;
                if (input.get('position') == 'footer') {
                    maxResults = 5;
                }
                In('suggest', function () {
                    new Suggest(input, {
                        maxResults: maxResults
                    });
                });
            }
        }
    });
    //音悦达人
    showDarenRewords();
    //自己的统计
    (function () {
        var keys = [];//ctrl+shift+alt+y快捷键
        document.onkeydown = function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            if (keyCode != 17 && keyCode != 18 && keyCode != 16 && keyCode != 89) {
                return;
            }
            if (!keys.contains(keyCode)) {
                keys.push(keyCode);
            }
            if (keys.length == 4) {
                keys.empty();
                var costTime = window['YYTrequestEnd'] - window['YYTrequestStart'];
                var msg = "CostTime : " + costTime + " ms\n";
                msg += "Host : " + window['YYThostName'] + "\n";
                msg += "Rev : " + window['YYTrev'];
                msg += "\n\n亲，你居然能按到这个神奇的快捷键！！";
                alert(msg);
            }
        };
        document.onkeyup = function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            keys.erase(keyCode);
        }
    })();
    /*//回到顶部
     In.add('returntop', {'path':urlStatic + '/js/widget/returntop.js?rev','type':'js'});
     In('returntop', function() {
     scroll.toTop('returnTop');
     })*/
});
function initSearchType(keywordInput) {
    var headKeywordParent = keywordInput.getParent('div.searchBar');
    var stElement = headKeywordParent.getElement('[name=st]');
    var searchTypeList = headKeywordParent.getElement('[name=searchTypeList]');
    var searchType = headKeywordParent.getElement('[name=searchType]');
    var hideTimer;
    stElement.addEvents({
        'mouseenter': function () {
            searchTypeList.setStyle('display', 'block');
            keywordInput.blur();
        },
        'mouseleave': function () {
            hideTimer = setTimeout(function () {
                hideTimer = 0;
                searchTypeList.fireEvent('mouseleave');
            }, 200);
        }
    });
    searchTypeList.addEvents({
        'mouseenter': function () {
            if (hideTimer) {
                clearTimeout(hideTimer);
            }
        },
        'mouseleave': function () {
            searchTypeList.setStyle('display', 'none');
        },
        'click': function (event) {
            var target = $(event.target);
            var tag = target.get('tag');
            var parentLi = target.getParent('li');
            if (tag == 'a' || tag == 'em') {
                searchType.set('value', parentLi.get('name'));
                stElement.set('html', parentLi.get('text') + '<b></b>');
                this.fireEvent('mouseleave');
            }
        }
    });
}
function showComplainDialog() {
    var uniqueId = 'complainDialog';
    var content = $('siteAdviceDiv').get('html');
    login.popupLogin(function () {
        mbox.show(uniqueId, '请说明投诉团长的理由', content, {
            width: 408,
            className: 'suggestnew',
            onInit: function (me) {
                me.initContent = "我要投诉**团长**";
                var siteAdviceForm = me.getElement('form');
                if (!siteAdviceForm) {
                    return;
                }
                var siteAdviceContent = $(siteAdviceForm['content']);
                siteAdviceContent.set("html", me.initContent);
                siteAdviceContent.addClass('hint_color');
                siteAdviceContent.addEvent("focus", function () {
                    if (this.value == me.initContent) {
                        this.value = "";
                        this.removeClass('hint_color');
                    }
                }.bind(siteAdviceContent));
                siteAdviceContent.addEvent("click", function () {
                    if (this.value == me.initContent) {
                        this.value = "";
                        this.removeClass('hint_color');
                    }
                }.bind(siteAdviceContent));
                siteAdviceContent.addEvent("blur", function () {
                    if (this.value == "") {
                        this.value = me.initContent;
                        this.addClass('hint_color');
                    }
                }.bind(siteAdviceContent));
                var warningInfo = me.getElement('[name=waring_info]');
                ajaxForm.init(siteAdviceForm, {
                    onRequest: function () {
                        var field = siteAdviceForm.elements['content'];
                        if (field.value.trim() == "" || field.value.trim() == me.initContent) {
                            warningInfo.set('html', '请输入您要投诉的内容');
                            warningInfo.setStyle('display', '');
                            field.addEvent('focus', function () {
                                warningInfo.setStyle('display', 'none');
                            });
                            return false;
                        }
                        return true;
                    },
                    onComplete: function (action) {
                        if (!action.error) {
                            successMessage("您的投诉已经提交成功，我们会尽快处理并通过站内消息回复。");
                            me.hide();
                        } else {
                            warningInfo.set('html', 'action.message');
                            warningInfo.setStyle('display', '');
                        }
                    }
                });
            }
        });
    }, null);
}
function showAdviceDialog() {
    var uniqueId = 'adviceDialog';
    var content = $('siteAdviceDiv').get('html');
    var initContent = "我们非常感谢您的用心，我们的点滴进步离不开您的建议反馈，环球冠品衷心的谢谢您，请在这里描述您遇到的问题。";
    mbox.show(uniqueId, '欢迎留下您的意见，经采用后有积分奖励哦', content, {
        width: 450,
        className: 'suggestnew',
        onInit: function (box) {
            var siteAdviceForm = box.getElement('form');
            if (!siteAdviceForm) {
                return;
            }
            var qqservice = box.getElement('iframe');
            if (qqservice) {
                qqservice.set('src',
                    'https://id.b.qq.com/static/account/bizqq/wpa/wpa_a06.html?type=6&kfuin=800002945&ws=www.tinyspace.com&btn1=%E5%9C%A8%E7%BA%BF%E5%AE%A2%E6%9C%8D');
            }
            var siteAdviceContent = $(siteAdviceForm['content']);
            siteAdviceContent.set("html", initContent);
            siteAdviceContent.addClass('hint_color');
            siteAdviceContent.addEvent("focus", function () {
                if (this.value == initContent) {
                    this.value = "";
                    this.removeClass('hint_color');
                }
            }.bind(siteAdviceContent));
            siteAdviceContent.addEvent("click", function () {
                if (this.value == initContent) {
                    this.value = "";
                    this.removeClass('hint_color');
                }
            }.bind(siteAdviceContent));
            siteAdviceContent.addEvent("blur", function () {
                if (this.value == "") {
                    this.value = initContent;
                    this.addClass('hint_color');
                }
            }.bind(siteAdviceContent));
            var warningInfo = box.getElement('[name=waring_info]');
            ajaxForm.init(siteAdviceForm, {
                loginBeforeSubmit: true,
                onRequest: function () {
                    var field = siteAdviceForm.elements['content'];
                    if (field.value.trim() == "" || field.value.trim() == initContent) {
                        warningInfo.set('html', '请输入您的意见或遇到的问题');
                        warningInfo.setStyle('display', '');
                        field.addEvent('focus', function () {
                            warningInfo.setStyle('display', 'none');
                        });
                        return false;
                    }
                    return true;
                },
                onComplete: function (action) {
                    if (!action.error) {
                        successMessage("您的意见已经提交成功，我们会尽快处理并通过站内消息回复。");
                        box.hide();
                    } else {
                        warningInfo.set('html', action.message);
                        warningInfo.setStyle('display', '');
                    }
                }
            });
        }
    });
}
function send_apply_fan(fid) {
    var uniqueId = 'sendApplyFan' + fid;
    var request = new Request({
        url: '/fan/ajax/send-fan-apply',
        method: 'get',
        data: 'fid=' + fid
    });
    login.popupLogin(function () {
        mbox.showAjax(uniqueId, "申请团长", request, {
            width: 440,
            onInit: function (mbox) {
                var form = mbox.getElement("form");
                form.action = "/fan/apply-for-fan";
                ajaxForm.init(form, {
                    onRequest: function () {
                        var field = form.elements['content'];
                        if (field.value.trim() == "") {
                            errorMessage("请输入申请的理由");
                            field.focus();
                            return false;
                        }
                        if (field.value.trim().length > 1000) {
                            errorMessage("内容不能超过1000字");
                            field.focus();
                            return false;
                        }
                        return true;
                    },
                    onComplete: function (result) {
                        if (!result.error) {
                            successMessage("申请已发送成功，请等待审核!");
                            mbox.hide();
                        } else {
                            errorMessage(result.message);
                        }
                    }
                });
            }
        })
    }, null);
}
function send_resign_fan(fid) {
    var uniqueId = 'resignApplyFan' + fid;
    var request = new Request({
        url: '/fan/ajax/send-fan-apply',
        method: 'get',
        data: 'fid=' + fid
    });
    login.popupLogin(function () {
        mbox.showAjax(uniqueId, "辞去团长", request, {
            width: 440,
            onInit: function (mbox) {
                var form = mbox.getElement("form");
                form.action = "/fan/resign-for-fan";
                ajaxForm.init(form, {
                    onRequest: function () {
                        var field = form.elements['content'];
                        if (field.value.trim() == "") {
                            errorMessage("请输入辞职的理由");
                            field.focus();
                            return false;
                        }
                        if (field.value.trim().length > 1000) {
                            errorMessage("内容不能超过1000字");
                            field.focus();
                            return false;
                        }
                        return true;
                    },
                    onComplete: function (result) {
                        if (!result.error) {
                            successMessage("辞职申请已发送成功，请等待审核!");
                            mbox.hide();
                        } else {
                            errorMessage(result.message);
                        }
                    }
                });
            }
        })
    }, null);
}
function send_message(friendId) {
    var uniqueId = 'sendMessage' + friendId;
    var request = new Request({
        url: '/home/message/ajax/write-message',
        method: 'get',
        data: 'friendId=' + friendId
    });
    login.popupLogin(function () {
        /*if (!emailVerifiedOrBinded) {
         checkEmail();
         } else {*/
        mbox.showAjax(uniqueId, "发送短消息", request, {
            width: 440,
            onInit: function (mbox) {
                var form = mbox.getElement("form");
                ajaxForm.init(form, {
                    onRequest: function () {
                        var field = form.elements['content'];
                        if (field.value.trim() == "") {
                            errorMessage("请输入消息内容");
                            field.focus();
                            return false;
                        }
                        if (field.value.trim().length > 1000) {
                            errorMessage("消息内容不能超过1000字");
                            field.focus();
                            return false;
                        }
                        return true;
                    },
                    onComplete: function (action) {
                        if (!action.error) {
                            successMessage("短消息发送成功");
                            mbox.hide();
                        } else {
                            errorMessage(action.message);
                        }
                    }
                });
            }
        });
        /*}*/
    }, null);
}
function follow(friendId, callback) {
    login.popupLogin(function () {
        if (userId == friendId) {
            errorMessage("似乎没必要关注自己哦");
            return
        }
        var requestUrl = "/home/friend/follow";
        var params = "friendId=" + friendId;
        new Request.JSON({
            url: requestUrl,
            method: 'post',
            data: params,
            onSuccess: function (action) {
                if (!action.error) {
                    successMessage(action.message);
                    if (callback) {
                        callback();
                    }
                } else {
                    errorMessage(action.message);
                }
            }
        }).send();
    }, null);
}

function openWindowCenter(url, width, height) {
    var windowSize = window.getSize();
    var windowWidth = windowSize.x;
    var windowHeight = windowSize.y;
    var offsetX, offsetY;
    if (width >= windowWidth) {
        offsetX = 0;
        width = windowWidth;
    } else {
        offsetX = (windowWidth - width) / 2;
    }
    if (height >= windowWidth) {
        offsetY = 0;
        height = windowHeight;
    } else {
        offsetY = (windowHeight - height) / 2;
    }
    window.open(url, 'newwindow',
        'height=' + height + ',width=' + width +
        ',left=' + offsetX + ',top=' + offsetY +
        ',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
}
function openPlafFormFail(message) {
    In("humanmessage", function () {
        errorMessage(message);
    })
}
function sinaLogined(loginResult) {
    login.loginComplete(loginResult);
    if (loginResult.firstlogined) {
        var request = new Request({
            url: '/ajax/binding',
            method: 'post'
        });
        In.load(urlStatic + '/css/bind.css?rev', 'css', null, function () {
            mbox.showAjax('sinaReg', '环球冠品', request, {
                width: 774,
                className: 'login_bind',
                onInit: function (box) {
                    var span = box.getElement('div.info span');
                    span.set('html', loginResult.userName + '的微博');
                    var source = box.getElement('div.first_come strong');
                    source.set('html', '新浪微博');
                    var img = box.getElement('div.info img');
                    img.setProperty('src', '/images/bind/sina.png');
                    var oForm = box.getElement('form');
                    ajaxForm.init(oForm, {
                        onRequest: function () {
                            var input = oForm.getElement('input');
                            input.disabled = true;
                            return true;
                        },
                        onComplete: function (action) {
                            if (action.error) {
                                var login_error = box.getElement('[name=login_error]');
                                login_error.setStyle('display', 'block');
                                login_error.getElement('em').set('html', action.message);
                                return false;
                            }
                            successMessage("与新浪微博绑定成功");
                            box.hide();
                            setTimeout(function () {
                                window.location.href = "/home/connection/info";
                            }, 500);
                        }
                    });
                    var oClose = box.getElement('a.popup_close');
                    if (oClose) {
                        oClose.addEvent('click', function () {
                            box.hide();
                            if (window.location.href.indexOf('home') >= 0 || window.location.href.indexOf('login') >= 0) {
                                window.location.href = "/home"
                            }
                            return false
                        });
                    }
                },
                onShow: function (box) {
                    $$('#pop-username,#pop-password').each(function (item) {
                        var val = item.get('value');
                        item.addEvents({
                            'focus': function () {
                                if (item.get('value') == val) {
                                    item.set('value', '');
                                }
                                item.getParent().addClass('focus');
                            },
                            'blur': function () {
                                if (item.get('value') == val || !item.get('value')) {
                                    item.getParent().removeClass('focus');
                                    item.set('value', val);
                                }
                            }
                        });
                    });
                    if (Browser.Engine.trident4) {
                        $('pop-form-loginBtn').addEvents({
                            'mouseover': function () {
                                this.className = 'hover';
                            },
                            'mouseout': function () {
                                this.className = '';
                            }
                        });
                    }
                    var enter = box.getElement('[name=enter_yyt]');
                    enter.addEvent('click', function () {
                        box.hide();
                        window.open("/reg_step3?callback=/home/connection");
                        return false;
                    });
                }
            });
        });
    }
}
function bindSinaSuccess(message, sinaUserId, sinaUserName) {
    In("humanmessage", function () {
        successMessage(message);
    });
    setTimeout(function () {
        var html = '<div class="binded"><img src="/images/bind/sync_sina.png" alt="新浪微博" title="新浪微博"/>' +
            '<img height="16" width="16" alt="绑定成功" src="/images/bind/ok.gif"/><b>已绑定新浪微博 ' +
            '<a href="http://t.sina.com.cn/' + sinaUserId + '" target="_blank" class="blue">' + sinaUserName + '</a></b></div>' +
            '<a href="javascript:void(0)" class="onbind" onclick="cancleBindSina()">取消绑定</a>' +
            '<a href="javascript:void(0)" class="shareBtn" name="SINA" title="设置同步动作" onclick="setSharePlatform(this)">设置同步动作</a>';
        if ($('sina')) {
            $('sina').set('html', html);
        }
    }, 200)
}
function renrenLogined(loginResult) {
    login.loginComplete(loginResult);
    if (loginResult.firstlogined) {
        var request = new Request({
            url: '/ajax/binding',
            method: 'post'
        });
        In.load(urlStatic + '/css/bind.css?rev', 'css', null, function () {
            mbox.showAjax('sinaReg', '环球冠品', request, {
                width: 774,
                className: 'login_bind',
                onInit: function (box) {
                    var oSpan = box.getElement('div.info span');
                    oSpan.set('html', loginResult.userName);
                    var source = box.getElement('div.first_come strong');
                    source.set('html', '人人网');
                    var img = box.getElement('div.info img');
                    img.setProperty('src', '/images/bind/renren.png');
                    var oForm = box.getElement('form');
                    if (oForm) {
                        ajaxForm.init(oForm, {
                            onRequest: function () {
                                var input = oForm.getElement('input');
                                input.disabled = true;
                                return true;
                            },
                            onComplete: function (action) {
                                if (action.error) {
                                    var login_error = box.getElement('[name=login_error]');
                                    login_error.setStyle('display', 'block');
                                    login_error.getElement('em').set('html', action.message);
                                    return false;
                                }
                                successMessage("与人人绑定成功");
                                box.hide();
                                setTimeout(function () {
                                    window.location.href = "/home/connection/info";
                                }, 500);
                            }
                        });
                    }

                    var oClose = box.getElement('a.popup_close');
                    if (oClose) {
                        oClose.addEvent('click', function () {
                            box.hide();
                            if (window.location.href.indexOf('home') >= 0 || window.location.href.indexOf('login') >= 0) {
                                window.location.href = "/home"
                            }
                            return false
                        });
                    }
                },
                onShow: function (box) {
                    $$('#pop-username,#pop-password').each(function (item) {
                        var val = item.get('value');
                        item.addEvents({
                            'focus': function () {
                                if (item.get('value') == val) {
                                    item.set('value', '');
                                }
                                item.getParent().addClass('focus');
                            },
                            'blur': function () {
                                if (item.get('value') == val || !item.get('value')) {
                                    item.getParent().removeClass('focus');
                                    item.set('value', val);
                                }
                            }
                        });
                    });
                    if (Browser.Engine.trident4) {
                        $('pop-form-loginBtn').addEvents({
                            'mouseover': function () {
                                this.className = 'hover';
                            },
                            'mouseout': function () {
                                this.className = '';
                            }
                        });
                    }
                    var enter = box.getElement('[name=enter_yyt]');
                    enter.addEvent('click', function () {
                        box.hide();
                        window.open("/reg_step3?callback=/home/connection");
                        return false;
                    });
                }
            });
        });
    }
}
function bindRenrenSuccess(message, renrenUserId, renrenUserName) {
    In("humanmessage", function () {
        successMessage(message);
    });
    setTimeout(function () {
        var html = '<div class="binded"><img src="/images/bind/sync_renren.png" alt="人人网" title="人人网"/>' +
            '<img height="16" width="16" alt="绑定成功" src="/images/bind/ok.gif"/><b>已绑定人人网 ' +
            '<a href="http://www.renren.com/profile.do?id=' + renrenUserId + '" target="_blank" class="blue">' + renrenUserName +
            '</a></b></div>' +
            '<a href="javascript:void(0)" class="onbind" onclick="cancleBindRenren()">取消绑定</a>' +
            '<a href="javascript:void(0)" class="shareBtn" name="RENREN" title="设置同步动作" onclick="setSharePlatform(this)">设置同步动作</a>';
        if ($('renren')) {
            $('renren').set('html', html);
        }
    }, 200)
}
function qqLogined(loginResult) {
    login.loginComplete(loginResult);
    if (loginResult.firstlogined) {
        var request = new Request({
            url: '/ajax/binding',
            method: 'post'
        });
        In.load(urlStatic + '/css/bind.css?rev', 'css', null, function () {
            mbox.showAjax('sinaReg', '环球冠品', request, {
                width: 774,
                className: 'login_bind',
                onInit: function (box) {
                    var span = box.getElement('div.info span');
                    span.set('html', loginResult.userName);
                    var source = box.getElement('div.first_come strong');
                    source.set('html', 'QQ登录');
                    var img = box.getElement('div.info img');
                    img.setProperty('src', '/images/bind/qqlogin.png')
                    var oForm = box.getElement('form');
                    ajaxForm.init(oForm, {
                        onRequest: function () {
                            var input = oForm.getElement('input');
                            input.disabled = true;
                            return true;
                        },
                        onComplete: function (action) {
                            if (action.error) {
                                var login_error = box.getElement('[name=login_error]');
                                login_error.setStyle('display', 'block');
                                login_error.getElement('em').set('html', action.message);
                                return false;
                            }
                            successMessage("与QQ绑定成功");
                            box.hide();
                            setTimeout(function () {
                                window.location.href = "/home/connection/info";
                            }, 500);
                        }
                    });
                    var oClose = box.getElement('a.popup_close');
                    if (oClose) {
                        oClose.addEvent('click', function () {
                            box.hide();
                            if (window.location.href.indexOf('home') >= 0 || window.location.href.indexOf('login') >= 0) {
                                window.location.href = "/home"
                            }
                            return false
                        });
                    }
                },
                onShow: function (box) {
                    $$('#pop-username,#pop-password').each(function (item) {
                        var val = item.get('value');
                        item.addEvents({
                            'focus': function () {
                                if (item.get('value') == val) {
                                    item.set('value', '');
                                }
                                item.getParent().addClass('focus');
                            },
                            'blur': function () {
                                if (item.get('value') == val || !item.get('value')) {
                                    item.getParent().removeClass('focus');
                                    item.set('value', val);
                                }
                            }
                        });
                    });
                    if (Browser.Engine.trident4) {
                        $('pop-form-loginBtn').addEvents({
                            'mouseover': function () {
                                this.className = 'hover';
                            },
                            'mouseout': function () {
                                this.className = '';
                            }
                        });
                    }
                    var enter = box.getElement('[name=enter_yyt]');
                    enter.addEvent('click', function () {
                        box.hide();
                        window.open("/reg_step3?callback=/home/connection");
                        return false;
                    });
                }
            });
        });
    }
}
function bindQQSuccess(message, openId, qqUserName) {
    In("humanmessage", function () {
        successMessage(message);
    });
    setTimeout(function () {
        var html = '<div class="binded"><img src="/images/bind/sync_qqlogin.png" alt="QQ登录" title="QQ登录"/>' +
            '<img height="16" width="16" alt="绑定成功" src="/images/bind/ok.gif"/><b>已绑定QQ ' +
            '<a href="javascript:void(0)" class="blue">' + qqUserName + '</a></b></div>' +
            '<a href="javascript:void(0)" class="onbind" onclick="cancleBindQQLogin()">取消绑定</a>' +
            '<a href="javascript:void(0)" class="shareBtn" name="QQ" title="设置同步动作" onclick="setSharePlatform(this)">设置同步动作</a>';
        if ($('qqlogin')) {
            $('qqlogin').set('html', html);
        }
    }, 200)
}
function baiduLogined(loginResult) {
    login.loginComplete(loginResult);
    if (loginResult.firstlogined) {
        var request = new Request({
            url: '/ajax/binding',
            method: 'post'
        });
        In.load(urlStatic + '/css/bind.css?rev', 'css', null, function () {
            mbox.showAjax('sinaReg', '环球冠品', request, {
                width: 774,
                className: 'login_bind',
                onInit: function (box) {
                    var span = box.getElement('div.info span');
                    span.set('html', loginResult.userName);
                    var source = box.getElement('div.first_come strong');
                    source.set('html', '百度');
                    var img = box.getElement('div.info img');
                    img.setProperty('src', '/images/bind/baidu.png');
                    var oForm = box.getElement('form');
                    ajaxForm.init(oForm, {
                        onRequest: function () {
                            var input = oForm.getElement('input');
                            input.disabled = true;
                            return true;
                        },
                        onComplete: function (action) {
                            if (action.error) {
                                var login_error = box.getElement('[name=login_error]');
                                login_error.setStyle('display', 'block');
                                login_error.getElement('em').set('html', action.message);
                                return false;
                            }
                            successMessage("与百度绑定成功");
                            box.hide();
                            setTimeout(function () {
                                window.location.href = "/home/connection/info";
                            }, 500);
                        }
                    });
                    var oClose = box.getElement('a.popup_close');
                    if (oClose) {
                        oClose.addEvent('click', function () {
                            box.hide();
                            if (window.location.href.indexOf('home') >= 0 || window.location.href.indexOf('login') >= 0) {
                                window.location.href = "/home"
                            }
                            return false
                        });
                    }
                },
                onShow: function (box) {
                    $$('#pop-username,#pop-password').each(function (item) {
                        var val = item.get('value');
                        item.addEvents({
                            'focus': function () {
                                if (item.get('value') == val) {
                                    item.set('value', '');
                                }
                                item.getParent().addClass('focus');
                            },
                            'blur': function () {
                                if (item.get('value') == val || !item.get('value')) {
                                    item.getParent().removeClass('focus');
                                    item.set('value', val);
                                }
                            }
                        });
                    });
                    if (Browser.Engine.trident4) {
                        $('pop-form-loginBtn').addEvents({
                            'mouseover': function () {
                                this.className = 'hover';
                            },
                            'mouseout': function () {
                                this.className = '';
                            }
                        });
                    }
                    var enter = box.getElement('[name=enter_yyt]');
                    enter.addEvent('click', function () {
                        box.hide();
                        window.open("/reg_step3?callback=/home/connection");
                        return false;
                    });
                }
            });
        });
    }
}
function bindBaiduSuccess(message, baiduUserId, baiduUserName) {
    In("humanmessage", function () {
        successMessage(message);
    });
    setTimeout(function () {
        var html = '<div class="binded"><img src="/images/bind/sync_baidu.png" alt="百度" title="百度"/>' +
            '<img height="16" width="16" alt="绑定成功" src="/images/bind/ok.gif"/><b>已绑定百度 ' +
            '<a href="http://hi.baidu.com/' + baiduUserName + '/home" target="_blank" class="blue">' + baiduUserName +
            '</a></b></div>' +
            '<a href="javascript:void(0)" class="onbind" onclick="cancleBindSina()">取消绑定</a>' +
            '<a href="javascript:void(0)" class="shareBtn" name="BAIDU" title="设置同步动作" onclick="setSharePlatform(this)">设置同步动作</a>';
        if ($('baidulogin')) {
            $('baidulogin').set('html', html);
        }
    }, 200)
}
function setMainVideo(videoId, artistName, videoTitle, callback) {
    login.popupLogin(function () {
        var requestUrl = "/mv/set-main-video";
        var params = "videoId=" + videoId;
        new Request.JSON({
            url: requestUrl,
            method: 'post',
            data: params,
            onSuccess: function (result) {
                if (!result.error) {
                    successMessage("OK啦，您已经把&nbsp;&nbsp;" + artistName + " - " + videoTitle + " 设为个人主页的主打歌!");
                    if (callback) {
                        callback();
                    }
                } else {
                    errorMessage("该曲目已经是您的个人主页主打歌了:)");
                }
            }
        }).send();
    }, null);
}
function addFavoriteVideo(target, videoId, artistName, videoTitle, callback) {
    target = $(target);
    var flag = target.get('flag');
    if (!flag) {
        target.set('flag', 1);
        login.popupLogin(function () {
            var requestUrl = "/mv/add-favorite";
            var params = "videoId=" + videoId;
            new Request.JSON({
                url: requestUrl,
                method: 'post',
                data: params,
                onSuccess: function (result) {
                    if (!result.error) {
                        var message = '';
                        if (artistName && videoTitle) {
                            message = 'OK啦，' + '您已经把&nbsp;&nbsp;' + artistName + " - " + videoTitle + '添加到收藏夹';
                        } else {
                            message = 'OK啦，已经添加到收藏夹';
                        }
                        successMessage(message, 1200);
                        if (callback) {
                            callback(videoId);
                        }
                    } else {
                        infoMessage(result.message, 1200);
                    }
                    target.erase('flag');
                }
            }).send();
        }, {
            hideCallback: function () {
                target.erase('flag');
            }
        });
    }
}
function addFavoritePlaylist(target, playlistId, callback) {
    target = $(target);
    var flag = target.get('flag');
    if (!flag) {
        target.set('flag', 1);
        login.popupLogin(function () {
            var requestUrl = "/pl/add-playlist-favorite";
            var params = "playlistId=" + playlistId;
            new Request.JSON({
                url: requestUrl,
                method: 'post',
                data: params,
                onSuccess: function (result) {
                    if (!result.error) {
                        successMessage("OK啦，您已经将该悦单添加到你的收藏夹");
                        if (callback) {
                            callback(playlistId);
                        }
                    } else {
                        infoMessage(result.message);
                    }
                    target.erase('flag');
                }
            }).send();
        }, {
            hideCallback: function () {
                target.erase('flag');
            }
        });
    }
}
function join_fanclub(artistId, callback) {
    login.popupLogin(function () {
        var requestUrl = "/home/fanclub/join-fanclub";
        var params = "artistId=" + artistId;
        new Request.JSON({
            url: requestUrl,
            method: 'post',
            data: params,
            onSuccess: function (action) {
                if (!action.error) {
                    successMessage("成功加入饭团" + action.artist_name);
                    if (callback) {
                        var joinFanClub = $('joinFanClub');
                        joinFanClub.setStyle('display', 'none');
                    }
                } else {
                    errorMessage(action.message);
                }
            }
        }).send();
    }, null);
}
function reloadDocument(delay) {
    delay = delay || 2000;
    setTimeout(function () {
        window.location.href = window.location.href;
    }, delay);
}

function checkComment(commentForm, commentMinLength, commentMaxLength) {
    var field = commentForm['content'];
    var length = field.value.trim().length;
    if (length == 0) {
        $('commentFormHint').set('html', "请输入评论内容");
        field.focus();
        return false;
    }
    if (length < commentMinLength) {
        $('commentFormHint').set('html', "评论应至少有" + commentMinLength + "个字");
        field.focus();
        return false;
    }
    if (length > commentMaxLength) {
        $('commentFormHint').set('html', "您的评论有点长哦，精简一下吧，请控制在" + commentMaxLength + "字以内");
        field.focus();
        return false;
    }
    $('commentFormHint').set('html', "");
    return true;
}
function showCommentForm(commentMaxLength) {
    if ($('comment_cp_open')) {
        $('comment_cp_open').tween('opacity', '0');
    }
    if ($('comment_cp')) {
        $('comment_cp').setStyles({
            'display': 'block',
            'height': '160px'
        });
    }
    if ($('userLogin')) {
        if (userId == 0) {
            $('userLogin').setStyle('display', 'block');
            if ($('buttonField')) {
                $('buttonField').setStyle('display', 'none');
            }
            if ($('editor')) {
                $('editor').setStyle('display', 'none');
            }
        } else {
            $('userLogin').setStyle('display', 'none');
            if ($('buttonField')) {
                $('buttonField').setStyle('display', 'block');
            }
            if ($('editor')) {
                $('editor').setStyle('display', 'block');
                $('editor').focus();
            }
            window.editorcheck = checkTextareaChar('editor', 'commentContentLength', commentMaxLength, 'showLeftCount');
        }
    } else {
        window.editorcheck = checkTextareaChar('editor', 'commentContentLength', commentMaxLength, 'showLeftCount');
    }
}
function hideCommentForm() {
    if ($('comment_cp')) {
        $('comment_cp').tween('height', '0');
        setTimeout(function () {
            $('comment_cp').setStyle('display', 'none');
        }, 500);
    }
    if ($('comment_cp_open')) {
        $('comment_cp_open').tween('opacity', '1');
    }
    if ($('commentForm')) {
        $('commentForm')['content'].value = "";
    }
    if ($('commentFormHint')) {
        $('commentFormHint').set('html', "");
    }
    clearInterval(window[editorcheck]);
    var synFanBox = $('synFanBox');
    if (synFanBox) {
        synFanBox.getElement('input[type=checkbox]').checked = false;
        synFanBox.setStyle('display', 'none');
    }
}
function errorMessage(message, lasttime) {
    var xhtml = message.split('\n');
    var msgContent = "";
    xhtml.each(function (item) {
        if (item.trim().length > 0) {
            msgContent += "<span>" + item + "</span>";
        }
    });
    if (messageOverrides != "") {
        In("humanmessage", function () {
            new HumanMessage(messageOverrides, {type: 'error', textAlign: 'center'}, lasttime);
        });
        return;
    }
    In("humanmessage", function () {
        new HumanMessage(msgContent, {type: 'error', textAlign: 'left'}, lasttime);
    });
}
function successMessage(message, lasttime) {
    var xhtml = message.split('\n');
    var msgContent = "";
    xhtml.each(function (item, index) {
        if (item.trim().length > 0) {
            if (index > 0) {
                msgContent += "<br/>";
            }
            msgContent += item;
        }
    });
    if (messageOverrides != "") {
        In("humanmessage", function () {
            new HumanMessage(messageOverrides, {type: 'error', textAlign: 'center'}, lasttime);
        });
        return;
    }
    In("humanmessage", function () {
        new HumanMessage(msgContent, {type: 'success', textAlign: 'center'}, lasttime);
    });
}

function infoMessage(message, lasttime) {
    var xhtml = message.split('\n');
    var msgContent = "";
    xhtml.each(function (item, index) {
        if (item.trim().length > 0) {
            if (index > 0) {
                msgContent += "<br/>";
            }
            msgContent += item;
        }
    });
    if (messageOverrides != "") {
        In("humanmessage", function () {
            new HumanMessage(messageOverrides, {type: 'error', textAlign: 'center'}, lasttime);
        });
        return;
    }
    In("humanmessage", function () {
        new HumanMessage(msgContent, {type: 'info', textAlign: 'center'}, lasttime);
    });
}
function checkTextareaChar(Element, msgBox, max, showLeftCharCount, hasDefaultChar) {
    var eleId = Element;
    Element = typeof Element == 'object' ? Element : $(Element);
    msgBox = typeof msgBox == 'object' ? msgBox : $(msgBox);
    var defaultChar = Element.value;
    var uuid = 'textarea' + (+new Date());
    var synFanBox = $('synFanBox');
    window[uuid] = setInterval(function () {
        if (!Element) {
            clearInterval(window[uuid]);
            return;
        }
        var currentLength = Element.value.length;
        //将评论同步到饭团
        synFanBox = $('synFanBox');
        if (eleId == 'editor' && synFanBox) {
            var currentDisplay = synFanBox.getStyle('display');
            if (currentLength > 200 && currentDisplay == "none") {
                synFanBox.setStyle('display', 'inline').fade('in');
            } else {
                if (currentLength < 200 && currentDisplay == 'inline') {
                    synFanBox.fade('out').setStyle('display', 'none');
                }
            }
        }
        if (currentLength > max) {
            Element.value = Element.value.substr(0, max)
        }
        if (!showLeftCharCount) {
            msgBox.set('html', currentLength);
        }
        else {
            if (hasDefaultChar && Element.value == defaultChar) {
                msgBox.set('html', max);
            }
            else {
                msgBox.set('html', max - currentLength);
            }
        }
    }, 250);
    return uuid;
}
/**
 * 初始化 tinyMCE 富文本编辑框控件，将其与指定 ID 的 textarea 关联
 * 注意，如果页面有可能关联多个（或多次）编辑框，要确保所有的 textAreaId 均不同
 * @param textAreaId 要关联的 textarea 的 ID
 */
function initRichTextArea(textAreaId) {
    richEditor.init({
        // General options
        mode: "exact",
        elements: textAreaId,
        theme: "advanced",
        plugins: "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave",

        // Theme options
        theme_advanced_buttons1: "bold,italic,underline,link,forecolor,backcolor,emotions,image,media,justifyleft,justifycenter,justifyright,fontselect,fontsizeselect",
        theme_advanced_buttons2: "",
        theme_advanced_toolbar_location: "top",
        theme_advanced_toolbar_align: "left",
        theme_advanced_fonts: '\u5B8B\u4F53=simsun;\u9ED1\u4F53=simhei;\u6977\u4F53=\u6977\u4F53;\u96B6\u4E66=\u96B6\u4E66;\u5E7C\u5706=\u5E7C\u5706;\u4EFF\u5B8B=\u4EFF\u5B8B_GB2312;\u5FAE\u8F6F\u96C5\u9ED1=microsoft yahei;Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms,sans-serif;Georgia=georgia,times new roman,times,serif;Courier New=courier new,courier,monospace;Impact=impact,chicago;Tahoma=tahoma,arial,helvetica,sans-serif;Verdana=verdana,geneva;',
        theme_advanced_font_sizes: "\u4E00\u53F7=26pt;\u5C0F\u4E00=24pt;\u4E8C\u53F7=22pt;\u5C0F\u4E8C=18pt;\u4E09\u53F7=16pt;\u5C0F\u4E09=15pt;\u56DB\u53F7=14pt;\u5C0F\u56DB=12pt;\u4E94\u53F7=10pt;\u5C0F\u4E94=9pt",
        // Example content CSS (should be your site CSS)
        //		content_css : "css/content.css",
        language: "zh",
        // Drop lists for link/image/media/template dialogs
        //		template_external_list_url : "lists/template_list.js",
        //		external_link_list_url : "lists/link_list.js",
        //		external_image_list_url : "lists/image_list.js",
        //		media_external_list_url : "lists/media_list.js",
        // Style formats
        style_formats: [
            {title: 'Bold text', inline: 'b'},
            {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
            {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
            {title: 'Example 1', inline: 'span', classes: 'example1'},
            {title: 'Example 2', inline: 'span', classes: 'example2'},
            {title: 'Table styles'},
            {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
        ],

        // Replace values for the template plugin
        template_replace_values: {
            username: "Some User",
            staffid: "991234"
        }
    });
}
/**
 * 将含有 title(文本框) content(与tinyMCE富文本编辑框关联的textarea) 字段的 form 给 ajax 化
 * 在提交之前检查 title content 的字数
 * 完成之后刷新页面，并关闭form所在的浮出层 mbox 实例(如果有的话)
 * @param form              需要 ajax 化的 form element
 * @param titleMinLength    标题最短字数
 * @param titleMaxLength    标题最长字数
 * @param contentMinLength  内容最小字数
 * @param contentMaxLength  内容最长字数
 * @param box               form 所在的浮出层 mbox 实例（可以不传本参数）
 */
function ajax_title_content_form(form, titleMinLength, titleMaxLength, contentMinLength, contentMaxLength, box, xheditor) {
    ajaxForm.init(form, {
        onRequest: function () {
            //richEditor.triggerSave();
            xheditor.getSource();
            var title = form['title'];
            var content = form['content'];
            var titleLength = title.value.trim().length;
            var contentLength = content.value.trim().length;
            if (titleMinLength > 0 && titleLength < titleMinLength) {
                errorMessage("标题应至少有" + titleMinLength + "个字");
                title.focus();
                return false;
            }
            if (titleMaxLength > 0 && titleLength > titleMaxLength) {
                errorMessage("您的标题有点长哦，请控制在" + titleMaxLength + "字以内吧");
                title.focus();
                return false;
            }
            if (contentMinLength > 0 && contentLength < contentMinLength) {
                errorMessage("内容应至少有" + contentMinLength + "个字");
                return false;
            }
            if (contentMaxLength > 0 && contentLength > contentMaxLength) {
                errorMessage("您的内容有点长哦，请控制在" + contentMaxLength + "字以内吧");
                return false;
            }
            successMessage("正在发表，请稍候...");
            return true;
        },
        onComplete: function (action) {
            if (!action.error) {
                if (box && box.hide) {
                    box.hide();
                }
                setTimeout(function () {
                    successMessage("发表成功,正在更新页面内容，请稍候...");
                }, 2600);
                setTimeout(function () {
                    window.location.reload();
                }, 3800);
            } else {
                setTimeout(function () {
                    errorMessage(action.message);
                }, 2800);
            }
        }
    });
}
function getSelectedText() {
    if (Browser.Engine.trident) {
        return document.selection.createRange().text;
    } else {
        return window.getSelection().toString();
    }
}
/**
 * 递归执行给定的函数，直到 start 值大于等于 end 值
 * 每次执行之后将 start 累加 increment
 * 例如平滑滚动窗口
 * 又例如将某个函数执行若干次
 * @param fn        要执行的函数，可选接收一个参数，为当前的 start 数值
 * @param interval  整数，每次执行的间隔毫秒数
 * @param end       整数，截止值
 * @param increment 整数，每次累加的值，若不指定则缺省为1
 * @param start     整数，起始值，若不指定则为0
 */
function executeInProgress(fn, interval, end, increment, start) {
    start = start || 0;
    if (increment < 0) {
        increment = increment || -1;
        if (start <= end) {
            return;
        }
    } else {
        increment = increment || 1;
        if (start >= end) {
            return;
        }
    }
    start += increment;
    fn(start);
    setTimeout(function () {
        executeInProgress(fn, interval, end, increment, start);
    }, interval);
}
/**
 * 将窗口平滑滚动到指定位置，每次滚动至少需要位移50像素
 * @param endY 指定的y坐标值
 */
function smoothScrollTo(endY) {
    var start = window.getScroll().y;
    var diff = endY - start;
    var reverse = diff < 0;
    var increment = Math.ceil(Math.abs(diff) / 10);
    if (increment < 50) {
        increment = 50;
    }
    increment = reverse ? 0 - increment : increment;
    executeInProgress(function (num) {
        window.scrollTo(window.getScroll().x, num);
    }, 20, endY, increment, start);
}
/**
 * 初始化 flash 剪贴板控件，函数名必须叫这个名字，否则那个 flash 控件会报错
 *
 * @param id   要复制的内容所在的 element 之id
 * @param name flash 剪贴板控件的名称
 */
function setcopy_gettext(id, name) {
    try {
        var element = $(id);
        if (element) {
            var clipboardswfdata;
            if (element.tagName.toLowerCase() == 'input') {
                clipboardswfdata = element.value;
            } else {
                clipboardswfdata = element.get('html');
            }
            window.document[name].SetVariable('str', clipboardswfdata);
        }
    } catch (e) {
    }
}
/**
 * flash 剪贴板控件的回调函数
 */
var floatwin = function () {
    alert('代码已经复制到粘贴板，您可以使用 Ctrl+V 将内容粘贴到需要的地方去了');
};
/**
 * 切换显示更多相关MV
 * @param videoId
 */
function toggleMoreRelatedMvs(videoId) {
    var moreRelatedMvsLink = $('moreRelatedMvsLink');
    if (moreRelatedMvsLink) {
        if (!cache.hiddenMvs) {
            cache.hiddenMvs = [];
        }
        cache.showHiddenMvs = cache.showHiddenMvs || false;
        if (!moreRelatedMvsLink.getProperty('ajaxFlag')) {
            moreRelatedMvsLink.setProperty('ajaxFlag', true);
            $('relatedMvs').innerHTML += '<div class="ajax_loading"></div>';
            new Request({
                url: '/mv/ajax/video_more_related?videoId=' + videoId,
                method: 'get',
                onSuccess: function (responseText) {
                    $$("#relatedMvs>div").dispose();
                    $("relatedMvs").innerHTML += responseText;
                    cache.hiddenMvs = $("relatedMvs").getElements("li[class=hidden]");
                    toggleMoreRelatedMvs(videoId);
                }
            }).send();
            return;
        }
        if (cache.showHiddenMvs) {
            cache.hiddenMvs.each(function (item) {
                item.removeClass("show");
                item.addClass("hidden");
            });
            cache.showHiddenMvs = false;
            moreRelatedMvsLink.removeClass("ico_stats_open");
            moreRelatedMvsLink.addClass("ico_stats_close");
            moreRelatedMvsLink.set("html", "展开更多");
        } else {
            cache.hiddenMvs.each(function (item) {
                item.removeClass("hidden");
                item.addClass("show");
            });
            cache.showHiddenMvs = true;
            moreRelatedMvsLink.removeClass("ico_stats_close");
            moreRelatedMvsLink.addClass("ico_stats_open");
            moreRelatedMvsLink.set("html", "收起列表");
        }
    }
}
/**
 * 去掉 url 前面的协议串、主机名、端口号，如果剩余空字符串，则返回 '/'
 * 例如 http://www.yourdomain.com:8080/my
 * 将返回 /my
 * 又例 http://abc.efg.hjg.xyz
 * 将返回 '/'
 *
 * @param url
 */
function stripUrlServerPart(url) {
    url = (url || '').trim();
    var matchResult = new RegExp(/(?:http:\/\/[^/]+)($|\/.*)/ig).exec(url);
    if (matchResult && matchResult.length && matchResult.length > 1) {
        var stripped = matchResult[1].trim();
        if (stripped == '') {
            return '/';
        } else {
            return stripped;
        }
    }
    return url;
}
function loginapi_js(ele) {
    var coop_box = ele.getElement('div.coop_box');
    if (coop_box) {
        var coop_ul = coop_box.getElement('ul');
        var icon = ele.getElement('div.icon');
        var coop_more = new Element('div', {
            'class': 'coop_more',
            'html': '<a href="javascript:void(0)">查看更多</a>'
        });
        var coop_lis = coop_ul.getElements('li');
        var coop_a = coop_more.getElement('a');
        var coop_login_a = coop_lis.getElement('a');
        var lis_size;
        coop_lis.each(function (item) {
            lis_size += item.getSize().y;
        });
        var icon_btm = new Element('div', {
            'class': 'icon_btm'
        });
        var coopUlTween = new Fx.Tween(coop_ul);
        coopUlTween.start('height', '44px');
        var li_length = coop_lis.length;
        if (li_length > 3 && li_length < 9) {
            coop_box.removeEvents('mouseenter');
            coop_box.addEvents({
                'mouseenter': function () {
                    coopUlTween.start('height', Math.ceil(coop_lis.length / 3) * 44 + 'px');
                }
            });
        } else {
            if (li_length >= 9) {
                coop_box.removeEvents('mouseenter');
                coop_box.addEvents({
                    'mouseenter': function () {
                        coopUlTween.start('height', '132px');
                        icon.setStyle('display', 'none');
                        coop_more.inject(coop_ul, 'after');
                        coop_more.setStyle('display', 'block');
                        if (icon_btm) {
                            icon_btm.setStyle('display', 'none')
                        }
                    }
                });
            }
        }
        if (li_length > 3) {
            icon.setStyle('display', 'block');
            coop_box.removeEvents('mouseleave');
            coop_box.addEvents({
                'mouseleave': function () {
                    coopUlTween.start('height', '44px');
                    icon.setStyle('display', 'block');
                    coop_more.setStyle('display', 'none');
                    if (icon_btm) {
                        icon_btm.setStyle('display', 'none')
                    }
                }
            });
        }
        coop_a.addEvent('click', function () {
            coop_more.setStyle('display', 'none');
            coop_ul.setStyle('height', lis_size);
            icon_btm.inject(coop_ul, 'after');
            icon_btm.setStyle('display', 'block');
            icon.setStyle('display', 'none')
        });
        //fix window.opener bug in sogou explorer ...
        coop_login_a.addEvent('click', (function () {
            if (navigator.userAgent.toLowerCase().indexOf('se 2.x') > -1 ? true : false) {
                var timer, count = 0;
                return function () {
                    if (count < 30) {
                        login.refreshLoginInfo();
                        count == 0 ? timer = setTimeout(arguments.callee, 10000) : timer = setTimeout(arguments.callee, 3000);
                        count++;
                    } else {
                        clearTimeout(timer);
                    }
                }
            }
        })());
    }
}

/**
 * 初始化 xheditor 文本编辑框控件，将其与指定的 textarea 关联
 * @param textarea 要关联的 textarea 的识别标志(jQuery写法)，如'#textarea','.textarea'.
 * @param sourceView 要关联的额外的查看源码按钮的识别标志(jQuery写法)，如'#toggle-source','.toggle-source'.
 * @param params 后端传图接口需要配合的参数，用于后端确定图片存放目录
 * @param cb <可选参数> 编辑器完全初始化完成后执行的回调函数名称，用于执行某些严格依赖于编辑器初始化完成后才能执行的函数
 * 调用样例：xheInit('#content','.toggleSource','${type}');
 */
function xheditorInit(textarea, sourceView, params, cb) {
    var In = window.In || undefined;
    //make sure in.js was loaded which is required!
    if (!In) {
        throw 'Please insert an &lt;script&gt; tag to include in-min.js first!' +
        '&lt;script type="text/javascript" src="' + urlStatic + '/js/in-min.js?rev" core="" autoload="false"&gt;&lt;/script&gt;';
    } else {
        //引入编辑器依赖的jQuery库和自身核心JS
        In.add('jquery', {path: urlStatic + '/js/xheditor/jquery/jquery-1.6.2.min.js?rev', type: 'js'});
        In.add('xheditor', {
            path: urlStatic + '/js/xheditor/xheditor-1.1.7-zh-cn.min.js?rev',
            type: 'js',
            rely: ['jquery']
        });
        //编辑器初始化
        var xheditor;
        return In('xheditor', function () {
            jQuery.noConflict();
            var options = {
                skin: 'default',
                tools: 'Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,SelectAll,Removeformat,Align,List,Outdent,Indent,Link,Unlink,Img,Flash,Emot,Table,Source',
                upImgUrl: '/editor/editor-img-upload?editorUploadType=' + params.type,
                upImgExt: 'jpg,jpeg,gif,png,bmp',
                upMediaUrl: '/editor/get-media-info',
                background: 'transparent url(' + urlStatic + '/js/xheditor/watermark/tinyspace-logo.png) no-repeat fixed right bottom',
                loading: urlStatic + '/js/xheditor/watermark/indicator_arrows.gif'
            };
            //fix for ie6 transparent background
            if (Browser.Engine.trident4) {
                delete options.background;
            }
            //xheditor's initialization is asynchronous!!
            xheditor = jQuery(textarea).xheditor(options);
            xheditor = xheditor instanceof Array ? xheditor.pop() : xheditor;
            //window.__xheditor=xheditor;//便于调试
            //是否有额外的外部查看源码按钮
            if (jQuery(sourceView).length > 0) {
                jQuery(sourceView).click(function () {
                    xheditor.toggleSource();
                    return false;
                });
            }
            return xheditor;//返回实例
        }, function () {
            if (cb) {
                cb(xheditor);
            }
        }).returns;
    }
}
function getPlayer(yinyuetaiplayer) {
    yinyuetaiplayer = yinyuetaiplayer || 'yinyuetaiplayer';
    if (window.document[yinyuetaiplayer]) {
        return window.document[yinyuetaiplayer];
    } else {
        if (navigator.appName.indexOf("Microsoft") == -1) {
            if (document.embeds && document.embeds[yinyuetaiplayer]) {
                return document.embeds[yinyuetaiplayer];
            }
        }
    }
    return document.getElementById(yinyuetaiplayer);
}
function playerPause() {
    var player = $('player');
    if (player) {
        player.setStyle('visibility', 'hidden');
    }
    var mvplayerboxs = $$('[name=mvplayerbox]');
    if (mvplayerboxs && mvplayerboxs.length > 0) {
        mvplayerboxs.each(function (item) {
            item.setStyle('visibility', 'hidden');
        });

    }
}
function playerPlay() {
    var player = $('player');
    if (player) {
        player.setStyle('visibility', 'visible');
    }
    var mvplayerboxs = $$('[name=mvplayerbox]');
    if (mvplayerboxs && mvplayerboxs.length > 0) {
        mvplayerboxs.each(function (item) {
            item.setStyle('visibility', 'visible');
        });
    }
}

/*音悦达人，由于音悦达人的ico是png24位的，而且图片地址由server获得，
 * 所以img先用opacity.png占位符占着(避免页面晃动)，在domready后再由js显示出来，方便对ie6作滤镜处理*/
function showDarenRewords(daren_icons) {
    daren_icons = daren_icons || $$('.daren_icon');
    if (daren_icons && daren_icons.length > 0) {
        var ie6 = Browser.Engine.trident4;
        daren_icons.each(function (item) {
            var data_src = item.get('data-src');
            if (ie6) {
                item.style.filter += "progid:DXImageTransform.Microsoft.AlphaImageLoader(src = '" + data_src + "', sizingMethod = 'scale')";
            } else {
                item.set('src', data_src);
            }
        })
    }
}

/*记录用户喜欢，记录在cookies中，登陆与非登陆用户都一样
 * @requestUrl 记录用户喜欢action 地址
 * @callback 记录成功后的回调函数，可以为空
 */
function setUserPreference(requestUrl, callback) {
    new Request.JSON({
        url: requestUrl,
        method: 'post',
        onSuccess: function (action) {
            if (action.error) {
                errorMessage(action.message);
            } else {
                if (callback) {
                    callback();
                }
            }
        }
    }).send();
}
function checkEmail() {		//邮箱验证
    In('mbox', function () {
        var request = new Request({
            url: '/ajax/check-email',
            method: 'post'
        });
        mbox.showAjax('checkEmail', '请先进行邮箱验证', request, {
            width: 400,
            className: 'checkEmail',
            onInit: function (box) {

            }
        });
    });
}
window.addEvent('domready', function () {
    var navtimer = 0;
    var mainNav = $('mainNav');
    var main_subNav = $('main_subNav');
    if (mainNav && main_subNav) {
        var sub_nav_show = mainNav.hasClass('sub_nav_show');//初始二级菜单是否显示
        var hasShowed = sub_nav_show; //临时变量，记录二级菜单背景是否显示了
        var mainnavs = mainNav.getElements('li');
        var last, current;
        var myFx = new Fx.Tween(main_subNav, {
            duration: 150
        });
        mainnavs.each(function (item) {
            if (item.hasClass('on')) {
                last = current = item;
            }
            item.addEvents({
                'mouseenter': function () {
                    navtimer = setTimeout(function () {
                        navtimer = 0;
                        var hassub = item.getElement('div.subnav_box');
                        if (sub_nav_show && item != current) {//本身带有二级菜单
                            swapLastItem(item);
                            return;
                        }
                        if (!sub_nav_show) {
                            if (hasShowed) {
                                if (item != last) {
                                    last.removeClass('hover');
                                    last = item;
                                }
                                if (hassub) {
                                    last.addClass('hover');
                                } else {
                                    hideSubNav();
                                }
                            } else {
                                hassub && showSubNav(item);
                            }
                        }
                    }, 100);
                },
                'mouseleave': function () {
                    clearTimeout(navtimer);
                }
            });
        });
        mainNav.getElement('ul').addEvents({
            'mouseleave': function () {
                if (last != current) {
                    swapLastItem(current);
                }
                if (!sub_nav_show) {
                    hideSubNav();
                    current && current.removeClass('hover');
                }
            }
        });
        function swapLastItem(obj) {
            last && last.removeClass('hover');
            obj && obj.addClass('hover');
            last = obj;
        }

        function showSubNav(item) {
            myFx.cancel();//调用的是hide的cancel处理函数；
            myFx.addEvent('cancel', function () {//cancel是给别人调用
                myFx.removeEvents('complete');
            });
            myFx.removeEvents('complete');
            myFx.addEvent('complete', function () {//complete是给自己调用的
                myFx.removeEvents('cancel');
                if (item != last) {
                    swapLastItem(item);
                } else {
                    last.addClass('hover');
                }
                hasShowed = true;
            });
            myFx.start('height', '41px');
        }

        function hideSubNav() {
            myFx.cancel();
            myFx.addEvent('cancel', function () {
                myFx.removeEvents('complete');
            });
            myFx.removeEvents('complete');
            myFx.addEvent('complete', function () {
                myFx.removeEvents('cancel');
                hasShowed = false;
            });
            myFx.start('height', '0');
        }
    }
});

//举报封装
function showReport(commentId, tit, content, type) {
    In.add('report-css', {'path': urlStatic + '/css/widget/report.css?rev', 'type': 'css'});
    In.add('report', {'path': urlStatic + '/js/widget/report.js?rev', 'type': 'js', 'rely': ['report-css']});
    In('report', function () {
        showReportBox(commentId, tit, content, type);
    });
}