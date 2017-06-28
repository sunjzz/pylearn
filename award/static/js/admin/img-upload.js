/**
 * 图片上传
 * Created with IntelliJ IDEA.
 * User: tinyspace
 * Date: 13-3-1
 * Time: 下午6:57
 * To change this template use File | Settings | File Templates.
 */

function checkXhr2() {
    return typeof(FormData) !== "undefined";
}

function setCss(node, css) {
    for (var key in css) {
        node.style[key] = css[key];
    }
}

function getFileLength(fileInput) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var fileSize = 0;
    if (isIE && !fileInput.files) {
        var filePath = fileInput.value;
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        var file = fileSystem.GetFile(filePath);
        fileSize = file.Size;
    } else {
        fileSize = fileInput.files[0].size;
    }
    return fileSize;
}

function calFileSize(size) {
    var sizeLabel = ["B", "KB", "MB", "GB"];
    for (var index = 0; index < sizeLabel.length; index++) {
        if (size < 1024) {
            return round(size, 2) + sizeLabel[index];
        }
        size = size / 1024;
    }
    return round(size, 2) + sizeLabel[index];
}

function round(number, count) {
    return Math.round(number * Math.pow(10, count)) / Math.pow(10, count);
}

function isImg(fileInput) {
    var filePath = fileInput.value;
    var re = /(\\+)/g;
    var filename = filePath.replace(re, "#");
    var one = filename.split("#");
    var two = one[one.length - 1];
    var three = two.split(".");
    var last = three[three.length - 1];
    last = last.toLowerCase();
    var tp = "jpg,jpeg,gif,bmp,png";
    var rs = tp.indexOf(last);
    return rs >= 0;
}

function resetFileInput(parent, fileInput) {
    var tmpForm = document.getElementById('tmpForm');
    if (!tmpForm) {
        tmpForm = document.createElement('form');
        tmpForm.id = 'tmpForm';
        tmpForm.name = 'tmpForm';
    }
    tmpForm.appendChild(fileInput);
    tmpForm.reset();
    parent.appendChild(fileInput);
}

function imgBuild(url) {
    var img = document.createElement('img');
    setCss(img, {
        maxWidth: '300px',
        maxHeight: '134px'
    });
    if (url) {
        img.style.display = 'inline';
        var currHref = document.location.href;
        var end = currHref.indexOf('/', 'http://'.length + 1);
        var actionUrl = currHref.substr(0, end) + '/get-full-url';
        new Request.JSON({
            url: actionUrl,
            method: 'get',
            data: 'url=' + url,
            onSuccess: function (res) {
                img.src = res['fullUrl'];
            }
        }).send();
    } else {
        img.style.display = 'none';
    }
    return img;
}

function imgUpload(inputId, plan, sizes, maxFileLength, belongId, overlayName, saveOriginal, callback) {
    var cmd = [];
    var srcImg = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    //console.log('srcImg: ', srcImg);
    if (sizes) {
        cmd[0] = {"sizes": sizes, "srcImg": srcImg, "op": "scale", "uniform": 1, "zoomUp": 0};
    }
    var saveCmd = {};
    var index = 1;
    saveCmd.op = 'save';
    saveCmd.plan = plan;
    if (!sizes) {
        index = 0;
        saveCmd.srcImg = srcImg;
    }
    saveCmd.saveOriginal = (saveOriginal === 0 ? 0 : 1);
    if (belongId) {
        saveCmd.belongId = belongId;
    }
    if (overlayName) {
        saveCmd.overlayName = overlayName;
    }
    cmd[index] = saveCmd;
    console.log('cmd : ', cmd);
    imgEdit(inputId, cmd, maxFileLength, callback);
}

function imgEdit(inputId, cmd, maxFileLength, callback) {
    if (checkXhr2()) {
        imgEditUseXhr2(inputId, cmd, maxFileLength, callback);
    } else {
        imgEditUseIframe(inputId, cmd, maxFileLength, callback);
    }
}

function imgEditUseXhr2(inputId, cmd, maxFileLength, callback) {
    var srcImg = cmd[cmd.length - 1]['srcImg'];
    if (!srcImg) {
        srcImg = cmd[cmd.length - 2]['srcImg'];
    }
    var fileText = $(inputId);
    fileText.size = '60';
    var container = fileText.getParent().getParent();
    fileText.type = 'hidden';

    //add img
    var img = imgBuild(fileText.value);
    img.style.verticalAlign = 'bottom';
    container.appendChild(img);

    //add upload file input
    var fileInput = document.createElement("input");
    fileInput.type = 'file';
    fileInput.id = srcImg;
    fileInput.name = srcImg;
    setCss(fileInput, {
        cursor: 'pointer',
        textAlign: 'right',
        zIndex: '10',
        fontSize: '118px', //font-size= 118px 工作正常
        position: 'absolute',
        top: '0px',
        right: '0px',
        opacity: '0',
        filter: 'Alpha(opacity:0)'
    });
    var fileDiv = document.createElement("div");
    setCss(fileDiv, {
        position: 'relative',
        direction: 'ltr',
        width: '65px',
        height: '24px',
        fontSize: '18px',
        overflow: 'hidden',
        lineHeight: '24px',
        marginRight: '10px',
        marginLeft: '10px',
        padding: '3px 0',
        textAlign: 'center',
        background: '#1D71B8',
        color: '#FFF',
        verticalAlign: 'bottom',
        display: 'inline-block'
    });
    fileDiv.appendChild(fileInput);
    var btnTxt = document.createTextNode('浏览');
    fileDiv.appendChild(btnTxt);
    container.appendChild(fileDiv);
    fileInput.onchange = function () {
        if (maxFileLength) {
            var maxSize = maxFileLength * 1024 * 1024;
            var fileLength = getFileLength(fileInput);
            if (fileLength > maxSize) {
                alert("文件不能大于: " + calFileSize(maxSize) + ". 当前文件大小为: " + calFileSize(fileLength));
                return;
            }
        }
        if (!isImg(fileInput)) {
            alert("请选择图片文件！");
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function (evt) {
            fileDiv.style.color = 'white';
            var resText = evt.target.responseText;
            if (!resText) {
                alert("上传图片出错！");
                return;
            }
            var imgResult = JSON.parse(resText);
            if (!imgResult) {
                console.log('imgResult: ', imgResult);
                return;
            }
            if (imgResult['imgErrs']) {
                alert(imgResult.imgErrs);
                return;
            }
            var images = imgResult.images;
            if (callback) {
                callback(img, fileText, images);
                return;
            }
            var url = images[0].path;
            img.src = url;
            img.style.display = 'inline';
            var start = url.indexOf('/', 'http://'.length + 1);
            fileText.value = url.substring(start);
        }, false);
        var formData = new FormData();
        formData.append('cmd', JSON.stringify(cmd));
        formData.append(srcImg, fileInput.files[0]);
        xhr.open('POST', '/upload-server/edit');
        xhr.send(formData);
        resetFileInput(fileDiv, fileInput);
        fileDiv.style.color = 'gray';
    };
}

function imgEditUseIframe(inputId, cmd, maxFileLength, callback) {
    var srcImg = cmd[cmd.length - 1]['srcImg'];
    //add target iframe
    var targetIfrName = srcImg + "_target_ifr";
    var target = document.createElement("iframe");
    target.src = 'about:blank';
    target.id = targetIfrName;
    target.name = targetIfrName;
    target.style.display = "none";
    document.body.appendChild(target);
    if (window.frames[targetIfrName]) {
        window.frames[targetIfrName].document.name = targetIfrName; //这里主要是兼容其他浏览器，比如FF
    }

    var fileText = $(inputId);
    fileText.size = '60';
    var inputContainer = fileText.getParent();
    fileText.type = 'hidden';

    //add img
    var img = imgBuild(fileText.value);
    inputContainer.appendChild(img);

    //add upload iframe
    var uploadIfrName = srcImg + "_upload_ifr";
    var uploadIfr = document.createElement("iframe");
    uploadIfr.src = 'about:blank';
    uploadIfr.id = uploadIfrName;
    uploadIfr.name = uploadIfrName;
    uploadIfr.scrolling = 'no';
    uploadIfr.frameborder = '0';
    uploadIfr.allowtransparency = 'yes';
    uploadIfr.style.border = 'none';
    uploadIfr.style.overflow = 'hidden';
    uploadIfr.width = '100';
    uploadIfr.height = '32';
    uploadIfr.border = '0';
    uploadIfr.marginwidth = '0';
    uploadIfr.marginheight = '0';
    inputContainer.appendChild(uploadIfr);
    if (window.frames[uploadIfrName]) {
        window.frames[uploadIfrName].document.name = uploadIfrName; //这里主要是兼容其他浏览器，比如FF
    }
    var uploadIfrDoc = window.frames[uploadIfrName].document;
    var isFireFox = navigator.userAgent.indexOf("Firefox") > 0;
    if (isFireFox) {
        uploadIfrDoc.designMode = "on";
        uploadIfrDoc.open();
    }
    var uploadIfrBody = uploadIfrDoc.body;
    if (!uploadIfrBody) {
        uploadIfrBody = uploadIfrDoc.createElement('body');
        uploadIfrDoc.appendChild(uploadIfrBody);
    }

    //add upload form to iframe
    var fileFormName = srcImg + "_form";
    var fileForm = uploadIfrDoc.createElement('form');
    fileForm.id = fileFormName;
    fileForm.method = 'post';
    fileForm.enctype = 'multipart/form-data';
    fileForm.target = targetIfrName;
    var currHref = document.location.href;
    var end = currHref.indexOf('/', 'http://'.length + 1);
    var redirect = currHref.substr(0, end) + '/img-gateway';
    fileForm.action = '/upload-server/edit?cmd=' + JSON.encode(cmd) + '&redirect=' + redirect;
    uploadIfrBody.appendChild(fileForm);

    //add upload file input to form
    var fileInput = uploadIfrDoc.createElement("input");
    fileInput.type = 'file';
    fileInput.id = srcImg;
    fileInput.name = srcImg;
    setCss(fileInput, {
        cursor: 'pointer',
        textAlign: 'right',
        zIndex: '10',
        fontSize: '118px', //font-size= 118px 工作正常
        position: 'absolute',
        top: '0px',
        right: '0px',
        opacity: '0',
        filter: 'Alpha(opacity:0)'
    });

    var fileDiv = uploadIfrDoc.createElement("div");
    setCss(fileDiv, {
        position: 'relative',
        direction: 'ltr',
        height: '18px',
        overflow: 'hidden',
        lineHeight: '18px',
        marginRight: '10px',
        padding: '3px 0',
        textAlign: 'center',
        background: '#1D71B8',
        color: '#FFF'
    });
    fileDiv.appendChild(fileInput);
    var btnTxt = uploadIfrDoc.createTextNode('浏览');
    fileDiv.appendChild(btnTxt);
    fileForm.appendChild(fileDiv);

    fileInput.onchange = function () {
        if (maxFileLength) {
            var maxSize = maxFileLength * 1024 * 1024;
            var fileLength = getFileLength(fileInput);
            if (fileLength > maxSize) {
                alert("文件不能大于: " + calFileSize(maxSize) + ". 当前文件大小为: " + calFileSize(fileLength));
                return;
            }
        }
        if (!isImg(fileInput)) {
            alert("请选择图片文件！");
            return;
        }
        fileForm.submit();
        resetFileInput(fileDiv, fileInput);
        fileDiv.style.color = 'gray';
    };

    if (target.attachEvent) {
        target.attachEvent("onload", onloadHandler);
    } else {
        target.onload = onloadHandler;
    }

    function onloadHandler() {
        fileDiv.style.color = 'white';
        var imgResult = JSON.decode(window.frames[targetIfrName].document.body.innerHTML);
        if (!imgResult) {
            console.log('imgResult: ', imgResult);
            return;
        }
        if (imgResult.error) {
            alert(imgResult.message);
            return;
        }
        var images = imgResult.images;
        if (callback) {
            callback(img, fileText, images);
            return;
        }
        var url = images[0].path;
        img.src = url;
        img.style.display = 'inline';
        var start = url.indexOf('/', 'http://'.length + 1);
        fileText.value = url.substring(start);
    }

    //关闭流
    if (isFireFox) {
        uploadIfrDoc.close();
        uploadIfrDoc.designMode = "off";
    }
}