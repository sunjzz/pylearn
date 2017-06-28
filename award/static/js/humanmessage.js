var lastIndex = 100;
Element.implement({
    centerLeft: function () {
        this.setStyle('left', parseInt((window.getWidth() - this.getCoordinates().width) / 2, 10) + 'px');
    },
    centerTop: function () {
        this.setStyle('top', ((window.getHeight() - this.getCoordinates().height) / 2) + 'px');
    },
    fixIEAlpha: function () {
        if (!Browser.Engine.trident4) {
            return this;
        }
        var url = this.getStyle('background-image');
        if (url === null || url == '' || url.indexOf(".png") < 0) {
            return this;
        }
        url = url.replace(/\.\.\/?/g, "").replace(/^.*\(/, "").replace(/\).*$/, "").replace(/http:\/\/[^\/]+/, "");
        this.setStyle("background-image", "none");
        this.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + url + ', sizingMethod="image")';
        return this;
    },
    center: function () {
        this.centerLeft();
        this.centerTop();
    },
    setUnselectable: function () {
        this.setAttribute('style', ((this.getAttribute('style') !== null) ? this.getAttribute('style') + ';' : '') +
            ' - moz - user - select:none;');
        if (Browser.Engine.trident) {
            this.setAttribute('unselectable', 'yes');
        }
    },
    bringToTop: function () {
        lastIndex++;
        this.setStyle('z-index', lastIndex);
    }
});
var HumanMessage = new Class({
    initialize: function (msg, options, lasttime) {
        this.lasttime = 3000;
        if (lasttime != null && lasttime > 0) {
            this.lasttime = lasttime;
        }
        playerPause();
        this.msg_outer = new Element('div',
            {
                styles: {
                    position: 'absolute', 'width': '684px', 'z-index': '9',
                    'opacity': '1', 'background': 'url(/images/widget/mbox/bg.png) 0 0 repeat'
                }, 'id': 'msg_outer'
            });
        this.msg_div = new Element('div',
            {
                styles: {
                    position: 'absolute', width: 550, 'text-align': 'left',
                    padding: '20px 20px 20px 90px', margin: '10px 0 10px 9px',
                    left: '0', 'font-size': 14, 'overflow': 'hidden', 'font-weight': 'bold',
                    'z-index': 1000, border: '3px solid #ccc', visibility: 'hidden'
                }, 'id': 'humanmsg'
            });
        this.msg_iframe = new Element('iframe',
            {
                styles: {
                    position: 'absolute', width: 605, 'z-index': '300',
                    'opacity': '0', 'left': 0, 'top': 0
                }, 'id': 'hm_ifm'
            });
        this.msg_div.innerHTML = msg;
        //		this.msg_div.inject(document.body);
        this.msg_div.inject(this.msg_outer);
        this.msg_outer.inject(document.body);
        this.msg_iframe.inject(document.body);
        if (options === undefined) {
            options = {};
        }
        if (!options.type) {
            options.type = 'error';
        }
        if (!options.textAlign || (options.textAlign != 'center' && options.textAlign != 'left' && options.textAlign != 'right')) {
            options.textAlign = 'center';
        }
        switch (options.type) {
            case 'success':
                this.msg_div.setStyles({
                    background: '#f5fff6 url(/images/right.png) 30px ' + ($('humanmsg').getSize().y - 24) / 2 + 'px no-repeat',
                    'color': '#690'
                });
                break;
            case 'error':
                this.msg_div.setStyles({
                    background: '#fdf2f2 url(/images/error.png) 42px ' + ($('humanmsg').getSize().y - 28) / 2 + 'px no-repeat',
                    'color': '#c00'
                });
                break;
            case 'info':
                this.msg_div.setStyles({
                    background: '#fffcee url(/images/warning.png) 40px ' + ($('humanmsg').getSize().y - 32) / 2 + 'px no-repeat',
                    'color': '#960'
                });
                break;
        }
        $$('#humanmsg li').setStyle('list-style-type', 'none');
        $('hm_ifm').setStyle('left', (window.getScroll().x + (window.getWidth() - 595) / 2));
        $('hm_ifm').setStyle('top', (window.getScroll().y + 80));
        $('msg_outer').setStyle('left', (window.getScroll().x + (window.getWidth() - 633) / 2));
        $('msg_outer').setStyle('top', (window.getScroll().y + 141));
        new Fx.Tween(this.msg_div, {duration: 500}).start("opacity", 0, 1);
        $('hm_ifm').setStyle('height', $('humanmsg').getSize().y);
        $('msg_outer').setStyles({
            height: $('humanmsg').getSize().y +
            20,
            visibility: 'visible',
            '-moz-border-radius': '3px',
            '-khtml-border-radius': '3px',
            '-webkit-border-radius': '3px'
        });
        $('hm_ifm').setStyle('visibility', 'visible');
        this.msg_outer.bringToTop();
        this.frame_fix = new Element('div', {
            styles: {
                position: 'absolute',
                left: 0,
                top: 0,
                width: 800,
                height: 600,
                'z-index': 999
            }
        });
        this.frame_fix.inject(document.body);
        this.frame_fix.center();
        this.mx = null;
        this.my = null;
        this.handler_move = this.move_handler.create({bind: this, event: true});
        this.handler_down = this.kill_msg.bind(this);
        document.addEvent.delay(200, document, ['mousemove', this.handler_move]);
        document.addEvent('mousedown', this.handler_down);
        //		this.delay_kill = this.kill_msg.delay(1800, this);
        this.delay_kill = this.kill_msg.delay(this.lasttime, this);
    },
    move_handler: function (ev) {
        if (this.mx === null || this.my === null) {
            this.mx = ev.clientX;
            this.my = ev.clientY;
            return;
        }
        if (ev.clientX == 0 || ev.clientY == 0) {
            return;
        }
        var xdiff = this.mx - ev.clientX, ydiff = this.my - ev.clientY;
        if (Math.sqrt(xdiff * xdiff + ydiff * ydiff) > 70) {
            this.kill_msg();
        }
    },
    kill_msg: function () {
        document.removeEvent('mousemove', this.handler_move);
        document.removeEvent('mousedown', this.handler_down);
        $clear(this.delay_kill);
        if (this.frame_fix) {
            this.frame_fix.dispose();
            delete this.frame_fix;
        }
        new Fx.Tween(this.msg_outer, {duration: 500}).start("opacity", 1, 0);
        new Fx.Tween(this.msg_div, {duration: 500}).start("opacity", 1, 0);
        window.setTimeout(function () {
            this.msg_div.dispose();
            this.msg_outer.dispose();
            this.msg_iframe.dispose();
            playerPlay();
        }.bind(this), 500);

    }
});
