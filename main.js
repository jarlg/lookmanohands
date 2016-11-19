chrome.runtime.onInstalled.addListener(install);
chrome.runtime.onStartup.addListener(startup);     // run when chrome starts up

chrome.runtime.onMessage.addListener(messageListener);

function install() {
    console.log("Fresh install; setting storage defaults (trying to keep webgazer data).");
    // set storage defaults
    var defaults = {
        "enabled": false,
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
    chrome.storage.local.get("enabled", initIcon);
    chrome.browserAction.onClicked.addListener(browserActionClicked);
}

function browserActionClicked(tab) {
    console.log("from within browser action");
    chrome.storage.local.get("enabled", toggle);
    
    // inject scroller into page
    console.log("injecting into page..");
    chrome.tabs.executeScript(null, { file: "content_script.js" });
}
function toggle(obj){
    if (!obj.enabled){
        chrome.storage.local.set({"enabled":true});
        console.log("SET TRUE")
    } else {
        chrome.storage.local.set({"enabled":false});
        console.log("SET FALSE")
    }
    initIcon(obj.enabled);
}

function initIcon(enabled) {
    // if the 'get' failed, e.g. if storage doesn't contain 'enabled
    // we just consider the app as enabled, and 
    if (chrome.runtime.lastError) {
        chrome.storage.local.set({"enabled":false});
        chrome.browserAction.setIcon({ path: "graphics/IconClosedSmall.png" });
    }
    else {
        if (enabled) {
            chrome.browserAction.setIcon({ path: "graphics/IconSmall.png" });
        }
        else {
            chrome.browserAction.setIcon({ path: "graphics/IconClosedSmall.png" });
        }
    }
}

function messageListener(request, sender, callback) {
    if (request.method == "storeWebgazeData") {
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
