var elementId = 'hello-world';
var injected = false;
var shown = false;

function hide() {
    // alert("DEBUG : content::hide ");
    document.getElementById(elementId).style.display = 'none';
    shown = false;
}

function show() {
    // alert("DEBUG : content::show ");
    document.getElementById(elementId).style.display = 'block';
    shown = true;
}

function inject(url) {
    // alert("DEBUG : content::inject " + url);
    var p = document.createElement('p');
    p.innerHTML = 'Hello world';
    p.id = elementId;
    var styles = { position: 'fixed', background: 'black', color: 'white', left: 0, top: 0 };
    for (var s in styles) {
        p.style[s] = styles[s];
    }
    document.body.appendChild(p);
    injected = shown = true;
}

function createBigImageList(){
    var imgs = document.getElementsByTagName('img');
    var bigImages = [];
    var counter = 0;
    for (var i = 0; i < imgs.length; i++){
        var width = imgs[i].clientWidth;
        var height = imgs[i].clientHeight;
        if(width > 150 && height > 150){
            bigImages.push(imgs[i].src);
            counter++;
        }
    }
    return bigImages;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // alert("DEBUG : content::onMessage.addListener  " + request.event);
    if (request.event !== 'stateChange') {
        return;
    }
    if (request.state && !injected) {
        inject();
    } else if (request.state && !shown) {
        show();
    } else {
        hide();
    }
});
chrome.runtime.sendMessage({ csReady: true , imgList: createBigImageList()});
