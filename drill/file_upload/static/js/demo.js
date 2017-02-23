/**
 * Created by Tony on 2017/2/23.
 */

window.onload = function () {
    var obj = ele("button");
    bind(obj, "click", function () {
        upload();
    });
};

function upload() {
    var form = new FormData();
    form.append("file", ele("file").files[0]);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var data = xhr.responseText;
            console.log(data);
        }
    };
    xhr.open("post", "/index/", true);
    xhr.send(form);
}

function bind(obj, type, fun) {
    return obj.addEventListener(type, fun, false);
}

function ele(eleId) {
    return document.getElementById(eleId);
}

