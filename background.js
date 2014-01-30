var isEnabled;
var ynetMarinaNode = null; // big images one micro bikini - ach 
var baseFolderName = "Great Pics";
var ynetFolderName = "http://www.ynet.co.il/articles/0,7340,L-4404608,00.html";
var IMAGE_LIST = null;
function refreshIcon() {
    var badge = "OFF";
    if (isEnabled) {
        badge = "ON";
    }
    chrome.browserAction.setBadgeText({ text: badge });
}
function notifyTab(tabId) {
    // alert("DEBUG : notifyTab " + tabId);
    chrome.tabs.sendMessage(tabId, { event: 'stateChange', state: isEnabled });
}
function notifyAllTabs() {
    // alert("DEBUG : notifyAllTabs ");
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
        // alert("getFirstChildByTitle length = " + iLength);
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
        while (iLength > 0 && iLength--) {
            var item = children[iLength];
            if (item.hasOwnProperty('url') && item.url == url) {
                return callback(item);
            }
        }
        return callback(false);
    });
};
function createTreeStep3(parentId, imageList){
    if(imageList && imageList.length != 0){
        for(var i = 0 ; i < imageList.length ; i++ ){
            alert("image url :::: " + imageList[i]);
            chrome.bookmarks.getFirstChildByUrl(parentId, imageList[i], function(value) {
            // alert("the germans got there - -- - ");
                if (value === false) {
                    chrome.bookmarks.create({
                        parentId: parentId,
                        // title: ("marina" + parentId + i),
                        url: imageList[i]
                    }, function (folder) {
                        // console.log(folderName + " not found and has been created at ID " + folder.id);
                        // alert(("marina" + parentId + i) + " not found and has been created at ID " + folder.id);
                    });
                }else{
                    // alert(("marina" + parentId + i) + " found value === " + value.title);
                }
            });
        }
    }
}
function createTreeStep2(parentId, imageList){
    chrome.bookmarks.getFirstChildByTitle(parentId, ynetFolderName, function(value) {
        // alert("the germans got there - -- - ");
        if (value === false) {
            chrome.bookmarks.create({
                parentId: parentId,
                title: ynetFolderName
            }, function (folder) {
                // console.log(folderName + " not found and has been created at ID " + folder.id);
                alert(baseFolderName + " not found and has been created at ID " + folder.id);
                createTreeStep3(folder.id, imageList);
            });
        }else{
            // alert(baseFolderName + " found value === " + value.title);
            createTreeStep3(value.id, imageList);
        }
    });
}
function createTreeStep1(parentId, imageList){
    chrome.bookmarks.getFirstChildByTitle(parentId, baseFolderName, function(value) {
        // alert("the germans got there - -- - ");
        if (value === false) {
            chrome.bookmarks.create({
                parentId: parentId,
                title: baseFolderName
            }, function (folder) {
                // console.log(folderName + " not found and has been created at ID " + folder.id);
                // alert(baseFolderName + " not found and has been created at ID " + folder.id);
                createTreeStep2(folder.id, imageList);
            });
        }else{
            // alert(baseFolderName + " found value === " + value.title);
            createTreeStep2(value.id, imageList);
        }
    });
}
function readBookmarks(imageList){
    createTreeStep1("2", imageList);
    // var baseFolderId = "-1";
    // var ynetFolderId = "-1";
    // chrome.bookmarks.getFirstChildByTitle("2", baseFolderName, function(value) {
    //     // alert("the germans got there - -- - ");
    //     if (value === false) {
    //         chrome.bookmarks.create({
    //             parentId: "2",
    //             title: baseFolderName
    //         }, function (folder) {
    //             // console.log(folderName + " not found and has been created at ID " + folder.id);
    //             // alert(baseFolderName + " not found and has been created at ID " + folder.id);
    //             baseFolderId = folder.id;
    //         });
    //     }else{
    //         // alert(baseFolderName + " found value === " + value.title);
    //         baseFolderId = value.id;
    //     }
    // });
    // alert("base folder id = " + baseFolderId);
    // if(baseFolderId != "-1"){
    //     chrome.bookmarks.getFirstChildByTitle(baseFolderId, ynetFolderName, function(value) {
    //         // alert("the germans got there - -- - ");
    //         if (value === false) {
    //             chrome.bookmarks.create({
    //                 parentId: baseFolderId,
    //                 title: ynetFolderName
    //             }, function (folder) {
    //                 // console.log(folderName + " not found and has been created at ID " + folder.id);
    //                 // alert(ynetFolderName + " not found and has been created at ID " + folder.id);
    //                 ynetFolderName = folder.id;
    //             });
    //         }else{
    //             // alert(ynetFolderName + " found value === " + value.title);
    //             ynetFolderName = value.id;
    //         }
    //     });
    // }
    // alert("ynet folder id = " + ynetFolderId);
    // if(ynetFolderId != "-1" && imageList && imageList.length != 0){
    //     for(var i = 0 ; i < imageList.length ; i++ ){
    //         chrome.bookmarks.getFirstChildByUrl(ynetFolderId, imageList[i], function(value) {
    //         // alert("the germans got there - -- - ");
    //             if (value === false) {
    //                 chrome.bookmarks.create({
    //                     parentId: ynetFolderId,
    //                     title: imageList[i],
    //                     url: imageList[i]
    //                 }, function (folder) {
    //                     // console.log(folderName + " not found and has been created at ID " + folder.id);
    //                     // alert(ynetFolderName + " not found and has been created at ID " + folder.id);
    //                 });
    //             }else{
    //                 // alert(ynetFolderName + " found value === " + value.title);
    //             }
    //         });
    //     }
    // }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.hasOwnProperty('imgList')){
        // IMAGE_LIST = request.imgList;
        alert("DEBUG : onMessage.addListener imgList " + request.imgList);      
        readBookmarks(request.imgList);
    }
    if (request.hasOwnProperty('csReady')) {
        // alert("DEBUG : onMessage.addListener csReady ");
        if (isEnabled) {
            notifyTab(sender.tab.id);
        }
    }
    
});
chrome.browserAction.onClicked.addListener(function() {
    // alert("DEBUG : onClicked.addListener ");
    isEnabled = !isEnabled;
    refreshIcon();
    notifyAllTabs();
    chrome.storage.sync.set({ state: isEnabled });
});
chrome.storage.local.get({ state: true }, function(result) {
    // alert("DEBUG : storage.local.get ");
    isEnabled = result.state;
    refreshIcon();
    if (isEnabled) {
        notifyAllTabs();
    }
});

