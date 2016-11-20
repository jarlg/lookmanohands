chrome.runtime.onInstalled.addListener(install);
chrome.runtime.onStartup.addListener(startup);     // run when chrome starts up

chrome.runtime.onMessage.addListener(messageListener);

chrome.tabs.onActivated.addListener(tabChangeHandler);

function install() {
    console.log("Fresh install; setting storage defaults (trying to keep webgazer data).");
    // set storage defaults
    var defaults = {
        "active": [],  // list of tabId
        "webgazerData": {
            "data": [],
            "settings": {}
        }
    };

    // use old values in storage
    chrome.storage.local.get(function(storage) {
        if (storage.webgazerData != null) {
            defaults.webgazerData = storage.webgazerData;
        }

        chrome.storage.local.set(defaults);
        startup();
    });
}

// registers browserAction.onClick event and initializes the icon
function startup() {
    console.log("from within startup");
    setIcon(false);
    chrome.browserAction.onClicked.addListener(browserActionClicked);
}

function browserActionClicked(tab) {
    console.log("from within browser action, id: " + tab.id);

    chrome.storage.local.get("active", function(obj) {
        var l = obj.active.length;
        var active = obj.active.filter(function(tabid) { return tabid !== tab.id; });

        console.log(obj);

        // if we're disactivating a tab
        if (l > active.length) {
            console.log("deactivating tab..");
            setIcon(false);
            chrome.tabs.sendMessage(tab.id, { type: "deactivate" });
        }
        // we're enabling a tab
        else {
            active.push(tab.id);
            initTab();
        }

        chrome.storage.local.set({ "active": active });
    });
}

function toggle(obj){
    if (!obj.enabled){
        chrome.storage.local.set({"enabled":true});
        console.log("SET TRUE")
    } else {
        chrome.storage.local.set({"enabled":false});
        console.log("SET FALSE")
    }
    setIcon(obj.enabled);
}

function setIcon(enabled) {
    if (enabled) {
            chrome.browserAction.setIcon({ path: "graphics/IconSmall.png" });
    }
    else {
            chrome.browserAction.setIcon({ path: "graphics/IconClosedSmall.png" });
    }
}

function messageListener(request, sender, callback) {
    if (request.method == "storeWebgazerData") {
        console.log("saving webgazer data to chrome.storage from recalibration");
        chrome.storage.local.set({ "webgazerData": request.payload });
    }
    else if (request.method == "initTab") {
        chrome.storage.local.get("webgazerData", function(payload) {
            console.log("sending data to tab");
            callback(payload);
        });
    }

    // return true for async responding
    return true;
}

function initTab(tabid) {
    setIcon(true);
    chrome.tabs.executeScript(null, { file: "content_script.js" });
};

function tabChangeHandler(activeInfo) {
    chrome.storage.local.get("active", function(obj) {
        // if activeInfo.tabId is an active tab, we should reactivate
        if (obj.active.indexOf(activeInfo.tabId) >= 0) {
            initTab();
        }
        else {
            setIcon(false);
        }

        // and deactivate other tabs
        obj.active.forEach(function(tabid) {
            if (tabid != activeInfo.tabId) {
                chrome.tabs.sendMessage(tabid, { type: "deactivate" });
            }
        });
    });
}
