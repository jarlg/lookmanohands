var scroll_down_flag = 0;
var scroll_up_flag = 0;
var start_time;
var speed, sensitivity;


window.addEventListener("message", function(event) {
    if (event.source != window)
        return;

    if (event.data.type) {
      if (event.data.type == "setup") {
        console.log("loading webgazerData");
        console.log(event.data.payload);
        start(event.data.payload.webgazerData);
        speed = event.data.payload.speed;
        sensitivity = event.data.payload.sensitivity;
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
    webgazer//.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            //If data and looking within screen boundaries
            if(data && (data.y < window.innerHeight) && (data.y > 0) && (data.x < window.innerHeight) && (data.x > 0)) 
            {
                sens_perc = (100-sensitivity)/100;
                if(data.y > sens_perc*window.innerHeight)
                {
                    if(!scroll_down_flag)
                    {
                        if(scroll_up_flag)    //Unset scroll up, eyes moved down
                            scroll_up_flag = 0;
                        scroll_down_flag = 1;

                        start_time = clock;
                    }
                    else if(clock-start_time >= 100) /*if beyond threshold for >= a second */
                    {
                        var x = window.innerHeight *(1-sens_perc)
                        window.scrollBy(0, speed * (((data.y-window.innerHeight*sens_perc)/x)*10));
                    }
                }
                else if(data.y < (1-sens_perc) * window.innerHeight)
                {
                    if(!scroll_up_flag)
                    {
                        if(scroll_down_flag)    //Unset scroll down, eyes moved up
                            scroll_down_flag = 0;
                        scroll_up_flag = 1;
                        start_time = clock;
                    }
                    else if(clock-start_time >=100)
                    {
                         var x = window.innerHeight *(1-sens_perc)
                        window.scrollBy(0, - speed * (((window.innerHeight*(1-sens_perc)- data.y)/x)*10));
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
  // .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */
}

