function showImages() {
    var imgUrlRegex = new RegExp('.*?\\.(jpg|jpeg|png|bmp|gif)\\s*$', 'i');
    $('.fieldvalue').forEach(function () {
        var nodes = $(this)[0].childNodes;
        for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            if (node.nodeName != 'DIV') {
                continue;
            }
            var url = node.innerHTML;
            if (!url) {
                continue;
            }
            var start = url.indexOf('<');
            if (start > 0) {
                url = url.substr(0, start);
            }
            if (!imgUrlRegex.test(url)) {
                continue;
            }
            if (url.indexOf('/') == -1) {
                continue;
            }
            if (url.substr(0, 'http://'.length) == 'http://') {
                var img = document.createElement('img');
                node.innerHTML = '';
                img.src = url;
                node.appendChild(img);
                continue;
            }
            //insertImg(node, url);
        }
    });

}

function insertImg(node, url) {
    var nodeHtml = node.innerHTML;
    var img = document.createElement('img');
    node.innerHTML = '';
    node.appendChild(img);
    var currHref = document.location.href;
    var end = currHref.indexOf('/', 'http://'.length + 1);
    var actionUrl = currHref.substr(0, end) + '/get-full-url';
    /*new Request.JSON({
     url : actionUrl,
     method : 'get',
     data : 'url=' + url,
     onSuccess : function(res) {
     var fullUrl = res['fullUrl'];
     if (!fullUrl) {
     node.innerHTML = nodeHtml;
     return;
     }
     img.src = fullUrl;
     }
     }).send();*/
}
