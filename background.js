var isEnabled = false;
var baseFolderName = "Great Pics";

function refreshIcon() {
    var badge = "";
    if (isEnabled) {
        badge = "Save";
    }
    chrome.browserAction.setBadgeText({ text: badge });
}

function notifyTab(tabId) {
    chrome.tabs.sendMessage(tabId, { event: 'stateChange', state: isEnabled });
}

function notifyAllTabs() {
    var query = {
        windowType: "normal",
        windowId: chrome.windows.WINDOW_ID_CURRENT
    };
    chrome.tabs.query(query, function(tabs) {
        tabs.filter(function(tab) {
            return tab.url.match(/^http/);
        }).map(function(tab) {
            return tab.id;
        }).forEach(notifyTab);
    });
}

chrome.bookmarks.getFirstChildByTitle = function (id, title, callback) {

    chrome.bookmarks.getChildren(id, function (children) {
        var iLength = children.length;
        while (iLength > 0 && iLength--) {
            var item = children[iLength];
            if (item.title == title) {
                return callback(item);
            }
        }
        return callback(false);
    });
};

chrome.bookmarks.getFirstChildByUrl = function (id, url, callback) {
    chrome.bookmarks.getChildren(id, function (children) {
        var iLength = children.length;
        if(iLength > 0 && iLength <= 50){// max 50 pics per folder 
            while (iLength--) {
                var item = children[iLength];
                if (item && item.hasOwnProperty('url') && (item.url == url)) {
                    return callback(item);
                }
            }
        }
        return callback(false);
    });
};

function addBigImages2Folder(parentId, imageList){
    if(imageList && imageList.length != 0){
        for(var i = 0 ; i < imageList.length ; i++ ){
            var imageUrl = imageList[i];
            chrome.bookmarks.getFirstChildByUrl(parentId, imageUrl, function(value) {
                if (value === false) {
                    chrome.bookmarks.create({
                        parentId: parentId,
                        url: imageUrl
                    }, function (folder) {
                        console.log(" image not found and has been created at ID " + folder.id);
                    });
                }else{
                    console.log("found value === " + value.title);
                }
            });
        }
    }
}

function createSiteFolder(parentId, imageList, tabUrl){
    chrome.bookmarks.getFirstChildByTitle(parentId, tabUrl, function(value) {
        if (value === false) {
            chrome.bookmarks.create({
                parentId: parentId,
                title: tabUrl
            }, function (folder) {
                addBigImages2Folder(folder.id, imageList);
            });
        }else{
            addBigImages2Folder(value.id, imageList);
        }
    });
}

function createBaseTree(parentId, imageList, tabUrl){
    chrome.bookmarks.getFirstChildByTitle(parentId, baseFolderName, function(value) {
        if (value === false) {
            chrome.bookmarks.create({
                parentId: parentId,
                title: baseFolderName
            }, function (folder) {
                createSiteFolder(folder.id, imageList, tabUrl);
            });
        }else{
            createSiteFolder(value.id, imageList, tabUrl);
        }
    });
}

function readBookmarks(imageList, tabUrl){
    if(imageList && imageList.length > 0 
        && null != tabUrl && tabUrl != '')
        createBaseTree("2", imageList, tabUrl);
}

function syncState(){
    isEnabled = !isEnabled;
    refreshIcon();
    notifyAllTabs();
    chrome.storage.local.set({ state: isEnabled });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.hasOwnProperty('imgList')){
        // alert("max bla "+ chrome.bookmarks.MAX_WRITE_OPERATIONS_PER_HOUR ); // 100
        // alert(" max susained bla " + chrome.bookmarks.MAX_SUSTAINED_WRITE_OPERATIONS_PER_MINUTE ); // 2
        readBookmarks(request.imgList, request.url);
        syncState();
    }
    if (request.hasOwnProperty('csReady')) {
        isEnabled = request.csReady;
        notifyTab(sender.tab.id);
    }
    
});

chrome.browserAction.onClicked.addListener(function() {
    syncState();
});

chrome.storage.local.set({ state: isEnabled });

chrome.storage.local.get({ state: true }, function(result) {
    // alert("DEBUG : storage.local.get ");
    isEnabled = result.state;
    refreshIcon();
    if (isEnabled) {
        notifyAllTabs();
    }
});

