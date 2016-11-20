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
                        console.log("set scroll down flag");

                        start_time = clock;
                    }
                    else if(clock-start_time >= 100) /*if beyond threshold for >= a second */
                    {
                        console.log("1 second passed; scrolling down");
                        console.log(window.scrollY);
                        var x = window.innerHeight *(1-sens_perc)
                        window.scrollBy(0, speed * (((data.y-window.innerHeight*sens_perc)/x)*10));
                        console.log(((data.y-window.innerHeight*sens_perc)/x)*10);
                    }
                }
                else if(data.y < (1-sens_perc) * window.innerHeight)
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
  .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */
var width = 320;
    var height = 240;
    var topDist = '0px';
    var leftDist = '0px';
    
    var setup = function() {
        var video = document.getElementById('webgazerVideoFeed');
        video.style.display = 'block';
        video.style.position = 'absolute';
        video.style.top = topDist;
        video.style.left = leftDist;
        video.width = width;
        video.height = height;
        video.style.margin = '0px';

        webgazer.params.imgWidth = width;
        webgazer.params.imgHeight = height;

        var overlay = document.createElement('canvas');
        overlay.id = 'overlay';
        overlay.style.position = 'absolute';
        overlay.width = width;
        overlay.height = height;
        overlay.style.top = topDist;
        overlay.style.left = leftDist;
        overlay.style.margin = '0px';

        document.body.appendChild(overlay);

        var cl = webgazer.getTracker().clm;

        function drawLoop() {
            requestAnimFrame(drawLoop);
            overlay.getContext('2d').clearRect(0,0,width,height);
            if (cl.getCurrentPosition()) {
                cl.draw(overlay);
            }
        }
        drawLoop();
    };

    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    setTimeout(checkIfReady,100);

console.log(webgazer.getRegression())
}

