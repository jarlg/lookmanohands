var scroll_down_flag = 0;
var scroll_up_flag = 0;
var start_time;

// chrome.runtime.sendMessage({ method: "init" });
// 
// chrome.runtime.onMessage.addListener(function (request, sender, callback) {
//     console.log("got request : " + request.method);
//     if (chrome.runtime.lastError) {
//         console.log(chrome.runtime.lastError);
//     }
//     else if (request.method == "init") {
//         startGazeTracker(request.payload);
//     }
// });

window.addEventListener("message", function(event) {
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "webgazerData")) {
        console.log("loading webgazerData");
        console.log(event.data.payload);
        start(event.data.payload);
    }
}, false);



function start(webgazerData) {
webgazer.setRegression('ridge') /* currently must set regression and tracker */
//   .setTracker('clmtrackr')
     .setGazeListener(function(data, clock) {
     //            console.log($(window).innerHeight);
     if(data)
     {
         if(data.y > .75* window.innerHeight)
         {
             if(!scroll_down_flag)
             {
                 if(scroll_up_flag)    //Unset scroll up, eyes moved down
                     scroll_up_flag = 0;
                 scroll_down_flag = 1;
                 console.log("set scroll down flag");
                 start_time = clock;
             }
             else if(clock-start_time >= 1000) /*if beyond threshold for >= a second */
             {
                 console.log("1 second passed; scrolling");
                 window.scrollBy(0,100);
             }
         }
         else if(data.y > .25 * window.innerHeight)
         {
             if(!scroll_up_flag)
             {
                 if(scroll_down_flag)    //Unset scroll down, eyes moved up
                     scroll_down_flag = 0;
                 scroll_up_flag = 1;
                 console.log("set scroll up flag");
                 start_time = clock;
             }
             else if(clock-start_time >=1000)
             {
                 console.log("1 second passed; scrolling up");
                 window.scrollBy(0,-100);
             }
             else{ //If look somewhere between thresholds, clear flags
                 if(scroll_down_flag | scroll_up_flag)
                 {
                     scroll_down_flag = scroll_up_flag = 0;
                 }
             }
 
         }      
     }                
     })
     .begin(webgazerData)
     .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */
}
