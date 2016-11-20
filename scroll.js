var scroll_down_flag = 0;
var scroll_up_flag = 0;
var start_time;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


window.addEventListener("message", function(event) {
    if (event.source != window)
        return;

    if (event.data.type) {
      if (event.data.type == "webgazerData") {
        console.log("loading webgazerData");
        console.log(event.data.payload);
        start(event.data.payload);
      }
      else if (event.data.type == "deactivate") {
        console.log("got deactivate signal..");
        var payload = webgazer.stop();
        window.postMessage({ type: "storeWebgazerData", payload: payload }, "*");
        location.reload(false); // false for redirect from cache
      }
    }
}, false);



function start(webgazerData) {

  webgazer.setRegression('ridge') /* currently must set regression and tracker */
      .setTracker('clmtrackr')
      .setGazeListener(function(data, clock) {
        //If data and looking within screen boundaries
        if(data && (data.y < window.innerHeight) && (data.y > 0) && (data.x < window.innerHeight) && (data.x > 0)) 
        {
          if(data.y > .75*window.innerHeight)
          {
            if(!scroll_down_flag)
            {
              if(scroll_up_flag)    //Unset scroll up, eyes moved down
                scroll_up_flag = 0;
              scroll_down_flag = 1;
              console.log("set scroll down flag");

              start_time = clock;
            }
            else if(clock-start_time >= 100) /*if beyond threshold for >= a second */
            {
              console.log("1 second passed; scrolling down");
              console.log(window.scrollY);
              window.scrollBy(0, data.y/window.innerHeight*20)
                console.log(window.scrollY);
            }
          }
          else if(data.y < .25 * window.innerHeight)
          {
            if(!scroll_up_flag)
            {
              if(scroll_down_flag)    //Unset scroll down, eyes moved up
                scroll_down_flag = 0;
              scroll_up_flag = 1;
              console.log("set scroll up flag");
              start_time = clock;
            }
            else if(clock-start_time >=100)
            {
              console.log("1 second passed; scrolling up");
              window.scrollBy(0, -data.y/window.innerHeight*20);
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
