chrome.storage.local.get("enabled", clickHandler);

function clickHandler(enabled, state) {
    // if the 'get' failed, e.g. if storage doesn't contain 'enabled
    // we just consider the app as enabled, and 
    if (chrome.runtime.lastError) {
        chrome.storage.local.set("enabled", false);
        // set icon to disabled
    }
    else {
        // toggle appState.enabled  on /off and update icon accordingly
        chrome.storage.local.set("enabled", !enabled);
        
        console.log("toggled.")
        // set icon to enabled
    }
}
