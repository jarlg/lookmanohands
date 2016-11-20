var clickCount = 0;

$("#link").click(function(e) {
    e.preventDefault();
    $("#welcome").animate({opacity: 0.00, height: 'toggle'}, 1000, function() {


    });
    $("#hand").css('visibility', 'visible');
    $("#hand").animate({opacity: 1.00, visibility: 'visible'}, 2500, function() {

    clickCount ++;
    });

});

$(document).on("click","body",function() {
    switch(clickCount) {
        case 1:
            $("#hand").animate({left: "36%"});
            break;
        case 2:
            $("#hand").animate({left: "61%"});
            break;
        case 3:
            $("#hand").animate({left: "86%"});
            break;
        case 4:
            $("#hand").animate({top: "20%", left: "5%"});
            break;
        case 5:
            $("#hand").animate({left: "36%"});
            break;
        case 6:
            $("#hand").animate({left: "61%"});
            break;
        case 7:
            $("#hand").animate({left: "86%"});
            break;
        case 8:
            $("#hand").animate({top: "40%", left: "5%"});
            break;
        case 9:
            $("#hand").animate({left: "36%"});
            break;
        case 10:
            $("#hand").animate({left: "61%"});
            break;
        case 11:
            $("#hand").animate({left: "86%"});
            break;
        case 12:
            $("#hand").animate({top: "60%", left: "5%"});
            break;
        case 13:
            $("#hand").animate({left: "36%"});
            break;
        case 14:
            $("#hand").animate({left: "61%"});
            break;
        case 15:
            $("#hand").animate({left: "86%"});
            break;
        case 16:
            $("#hand").animate({top: "75%", left: "5%"});
            break;
        case 17:
            $("#hand").animate({left: "36%"});
            break;
        case 18:
            $("#hand").animate({left: "61%"});
            break;
        case 19:
            $("#hand").animate({left: "86%"});
            break;
        case 20:
            window.location.href = "success.html";
    }
    if (clickCount > 0){
        clickCount ++;
    }
});
