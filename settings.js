$("#setSettings").click(function(){
    console.log("HERE");
    chrome.runtime.sendMessage({method: "speed", payload: $("#speed").value });
    chrome.runtime.sendMessage({method: "sensitivity", payload: $("#sensitivity").value});
});
