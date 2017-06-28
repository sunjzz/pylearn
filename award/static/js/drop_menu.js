/**
 * Created by ldb on 2016/11/24.
 */
// Dropdown Menu
var dropdown = document.querySelectorAll('.dropdown');
var dropdownArray = Array.prototype.slice.call(dropdown, 0);
var pathName = window.location.pathname;
var moduleExp = /^\/admin\/([^/]+)(?:$|\/.*$)/;

dropdownArray.forEach(function (el) {
    var button = el.querySelector('a[data-toggle="dropdown"]'),
        menu = el.querySelector('.dropdown-menu'),
        arrow = button.querySelector('i.icon-arrow'),
        links = menu.querySelectorAll('a');
    var linkArray = Array.prototype.slice.call(links, 0);
    linkArray.forEach(function (subEl) {
        var link = subEl.href;
        if (link != null) {
            var matchedIndex = false;
            var shortLink = link;
            if (link.indexOf("?") > 0) {
                shortLink = link.substring(0, link.indexOf("?"));
            }
            if (shortLink.indexOf("http") == 0) {
                shortLink = shortLink.substring(shortLink.indexOf("/", 9));
            }
            if (shortLink.indexOf(pathName) > 0) {
                matchedIndex = true;
            } else {
                var matchResult = shortLink.match(moduleExp);
                if (matchResult != null && matchResult.length > 1 && pathName.indexOf(matchResult[0]) > -1) {
                    matchedIndex = true;
                    subEl.classList.add("active");
                }
            }


            if (matchedIndex) {
                menu.classList.add('show2');
                arrow.classList.add('open');
                arrow.classList.remove('close');
            }
        }
    })
    button.onclick = function (event) {
        if (!menu.hasClass('show') && !menu.hasClass('show2')) {
            jQuery(menu).parent().parent().siblings().each(function () {
                jQuery(this).children("li").children("ul").removeClass("show").removeClass("show2")
            });

            menu.classList.add('show');
            menu.classList.remove('hide');
            arrow.classList.add('open');
            arrow.classList.remove('close');
            event.preventDefault();
        }
        else {
            menu.classList.remove('show');
            menu.classList.remove('show2');
            menu.classList.add('hide');
            arrow.classList.remove('open');
            arrow.classList.add('close');
            event.preventDefault();
        }
    };
})

Element.prototype.hasClass = function (className) {
    return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
};