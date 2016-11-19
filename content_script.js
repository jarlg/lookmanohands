// inject a script tag into the page
// needs to be given webgazeData somehow
var s = document.createElement('script');
var t = document.createElement('script');

s.src = chrome.extension.getURL('webgazer.js');
t.src = chrome.extension.getURL('scroll.js');

(document.head||document.documentElement).appendChild(s);

s.onload = function() {
    s.parentNode.removeChild(s);

    (document.head||document.documentElement).appendChild(t);
    
    t.onload = function() {
        t.parentNode.removeChild(t);

        chrome.runtime.sendMessage({ method: "initTab" }, function(payload) {
            window.postMessage({ type: "webgazerData", payload: payload.webgazerData }, "*");
        });
    }
};
