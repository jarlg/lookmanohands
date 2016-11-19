chrome.runtime.sendMessage({ method: "init" }, function(response) {
    console.log(response);
});
