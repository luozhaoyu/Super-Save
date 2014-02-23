responseHandler = function(response) {
    console.log('content.js responseHandler: ' + response['status']);
};

biggerPicture = function(x, y) {
    return x['size'] - y['size'];
};

getVisibleImgs = function() {
    var imgs = document.getElementsByTagName('img');
    var visibleImgs = [];
    var ix, iy;
    for (var i = 0; i < imgs.length; i++) {
        img = imgs[i];
        if ((img.x != undefined) && (img.y != undefined)) {
            ix = img.x + img.width / 2;
            iy = img.y + img.height / 2;
        } else {
            console.log(img.src + '没有属性x和y');
            continue;
        }
        if ((this.scrollX < ix) && (ix < this.scrollX + window.innerWidth) &&
            (this.scrollY < iy) && (iy < this.scrollY + window.innerHeight))
            visibleImgs.push(img);
    }
    return visibleImgs;
};

savePicture = function() {
    var target;
    var imgs, pics = [];
    imgs = getVisibleImgs();
    if (imgs && imgs.length > 0) {
        for (var i = 0; i < imgs.length; i++) {
            pics[i] = {
                height: imgs[i]['height'],
                width: imgs[i]['width'],
                size: imgs[i]['height'] * imgs[i]['width'],
                src: imgs[i]['src'],
                x: imgs[i]['x'],
                y: imgs[i]['y'],
            }
        }
        pics.sort(biggerPicture);
        target = pics.pop();
    } else {
        console.log("No picture detected!");
        return;
    }

    if (target && (target['size'] > 400 * 300 ||
        confirm("Image is too small, are you sure? " + target['width'] + '*' + target['height']))) {
            console.log(target['src']);
            chrome.extension.sendMessage(target['src'], responseHandler);
        }
};


onKeyPress = function(keyevent) {
    var k, targetName;
    k = String.fromCharCode(keyevent.charCode);
    targetName = keyevent.target.nodeName.toLowerCase();
    // TODO: need to find better way to avoid invoking saving when typing
    if (targetName == 'body' || targetName == 'div') {
        if (key_func_mappings.hasOwnProperty(k))
            key_func_mappings[k]();
        return k;
    }
};


init = function() {
    document.addEventListener("keypress", onKeyPress, useCapture=true);
};


key_func_mappings = {
    'S': savePicture,
};


init();
