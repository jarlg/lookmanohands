chrome.runtime.onInstalled.addListener(install);
chrome.runtime.onStartup.addListener(startup);     // run when chrome starts up

chrome.runtime.onMessage.addListener(messageListener);

chrome.tabs.onActivated.addListener(function(activeInfo) {
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
});

chrome.tabs.onUpdated.addListener(function(tabid, changeInfo, tab) {
    chrome.storage.local.get("active", function(obj) {
        // if current tab is active, when we follow a link we reinitialize
        if (obj.active.indexOf(tabid) >= 0) {
            initTab();
        }
    });
});

function install() {
    console.log("Fresh install; setting storage defaults (trying to keep webgazer data).");
    // set storage defaults
    var defaults = {
        "active": [],  // list of tabId
        "webgazerData": {
            "data": [],
            "settings": {}
        },
        "speed": 1,
        "sensitivity": 25
    };

    // use old values in storage
    chrome.storage.local.get(function(storage) {
        if (storage.webgazerData != null) {
            defaults.webgazerData = storage.webgazerData;
        }
        if (storage.speed != null) {
            defaults.speed = storage.speed;
        }
        if (storage.sensitivity != null) {
            defaults.sensitivity = storage.sensitivity;
        }

        chrome.storage.local.set(defaults);
        startup();
    });
}

// open the calibration page on install
function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "calibration.html"});
}
install_notice();

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
    else if (request.method == "speedSetting") {
            console.log("saving speed setting");
            chrome.storage.local.set({"speed": request.payload });
    }
    else if (request.method == "sensitivitySetting") {
            console.log("saving sensitivity setting");
            chrome.storage.local.set({"sensitivity": request.payload});
    }
    else if (request.method == "getSpeedSetting"){
            chrome.storage.local.get("speed", function(payload){
                    console.log("sending speed setting");
                    callback(payload);
        });
    }
    else if (request.method == "getSensitivitySetting"){
            chrome.storage.local.get("sensitivity", function(payload){
                    console.log("sending sensitivity setting");
                    callback(payload);
        });
    }
    else if (request.method == "initTab") {
        chrome.storage.local.get(null, function(payload) {
                    callback(payload);
                });
    }

    //return true for async responding
    return true;
}

function initTab(tabid) {
    setIcon(true);
    chrome.tabs.executeScript(null, { file: "content_script.js" });
};
