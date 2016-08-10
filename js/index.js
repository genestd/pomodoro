$(document).ready( function(){
//event handlers for the + and - buttons
// to set number of sessions and work and rest periods
$("#workPlus").on("click",function(){
  if( !timer.isRunning() && !timer.isPaused() ){
    if( workTime < 60 ){
      $("#workPlus").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
      workTime++;
      $("#workTime").html(workTime);
      $("#timer").html( workTime + ":00");
    }
  } else {
    showWarning("Please stop the current timer before making changes.", $("#sessionMsg"));
  }
});
$("#sessionPlus").on("click", function(){
  if( !timer.isRunning() && !timer.isPaused() ){
    $("#sessionPlus").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
    sessionCount++;
    $("#sessionCount").html(sessionCount);
  } else {
    showWarning( "Please stop the current timer before making changes.", $("#sessionMsg"));
  }
});
$("#sessionMinus").on("click", function(){
  if( !timer.isRunning() && !timer.isPaused() ){
    if (sessionCount > 0){
      $("#sessionMinus").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
      sessionCount--;
      $("#sessionCount").html(sessionCount);
    }
  } else {
    showWarning( "Please stop the current timer before making changes.", $("#sessionMsg"));
  }
});
$("#workMinus").on("click",function(){
  if ( !timer.isRunning() && !timer.isPaused() ){
    if( workTime > 1){
      $("#workMinus").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
      workTime--;
      $("#timer").html( workTime + ":00");
    }
    $("#workTime").html(workTime);
  } else {
    showWarning("Please stop the current timer before making changes.", $("#sessionMsg"));
  }
});
$("#restPlus").on("click",function(){
  if ( !timer.isRunning() && !timer.isPaused() ){
    if( restTime < 60 ){
      $("#restPlus").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
      restTime++;
    }
    $("#restTime").html(restTime);
  } else {
    showWarning("Please stop the current timer before making changes.", $("#sessionMsg"));
  }
});
$("#restMinus").on("click",function(){
  if (!timer.isRunning() && !timer.isPaused() ){
    if( restTime > 1){
      $("#restMinus").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
      restTime--;
    }
    $("#restTime").html(restTime);
  } else {
    showWarning("Please stop the current timer before making changes.", $("#sessionMsg"));
  }
});

  $("#btnPlay").on("click", function(){
    if (timer.isRunning() || timer.isPaused() ){
      showWarning( "Please stop the current timer before starting a new one.", $("#warning"));
    } else {
      $("#btnPlay").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
      $("#progressCircle").css("stroke-dasharray",length);
      $("#progressCircle").css("stroke-dashoffset",length);
      startTimer();
    }
  });
  $("#btnPause").on("click", function(){
    if (timer.isRunning()){
      $("#btnPause").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
      timer.pause();
    } else if ( timer.isPaused() ){
      $("#btnPause").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
      timer.start();
    }
  });
  $("#btnStop").on("click", function(){
    if ( timer.isRunning() || timer.isPaused() ){
      $("#btnStop").velocity({translateY:"4px"}, {duration:75}).velocity("reverse");
      timer.stop();
      $("#progressCircle").css("stroke-dasharray","");
      $("#progressCircle").css("stroke-dashoffset","");
      $("#message").html("Timer stopped")
      $("#timer").html("00:00");
    } else {
    }
  });
});

var timer = new Timer();
var length = $("#progressCircle").get(0).getTotalLength();
var percent = 0;
var totalSeconds = 60;
var workTime = 25;
var restTime = 5;
var sessionCount = 4;
var activity = "Work";

// users not allowed to change settings or
// start new timer without stopping the current timer
function showWarning(msg, elem){
  elem.velocity("stop", true);
  elem.html(msg);
  elem
  .velocity( {opacity:1}, {duration:100})
  .velocity( "callout.shake")
  .velocity( {opacity:0}, {delay:3000});

  //$("#warning").velocity("stop", true);
  //$("#warning").html(msg);
  //$("#warning")
  //.velocity( {opacity:1}, {duration:100})
  //.velocity( "callout.shake")
  //.velocity( {opacity:0}, {delay:3000});
}
function showMessage(msg){
  $("#message").html(msg);
}
function startTimer(){
  showMessage( activity + " time remaining:");
  percent = 0;
  if( activity == "Work"){
    totalSeconds = workTime * 60;
  } else {
    totalSeconds = restTime * 60;
  }
  timer = new Timer();
  timer.start({countdown:true, startValues:{ minutes: (totalSeconds/60)}} );
  timer.addEventListener('secondsUpdated', function (e) {
      $('#timer').html(timer.getTimeValues().toString(["minutes","seconds"]));
      percent++;
      offset = length - (length/totalSeconds)*percent;
      console.log(offset + " " + percent + " " );
      $("#progressCircle").velocity( {'stroke-dashoffset':offset},{duration:950});
  });
  timer.addEventListener( 'targetAchieved', function(e) {
    showWarning( activity + " session completed!", $("#warning"));
    if (activity == "Work"){
      activity = "Rest";
    } else {
      activity = "Work";
      sessionCount--;
      $("#sessionCount").html(sessionCount);
    }
    if (sessionCount > 0){
      if (timer.isRunning()){
        timer.stop();
      }
      startTimer();
    } else {
      showWarning( "Pomodoro Session Completed!", $("#warning"));
    }

  });
}
