window.onload = function() {
    chrome.runtime.sendMessage({method: "getSettings"}, function(payload) {
        $("#speed").val(payload.speed);
        $("#sensitivity").val(payload.sensitivity);
    });
}

$("#setSettings").click(function(){
    chrome.runtime.sendMessage({method: "speedSetting", payload: $("#speed").val() });
    chrome.runtime.sendMessage({method: "sensitivitySetting", payload: $("#sensitivity").val() });

    $('.alert-success').css('visibility', 'visible');
});
