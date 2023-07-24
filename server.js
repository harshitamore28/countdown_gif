var express = require('express');
var app = express();
var port = process.env.PORT || 4000;

app.listen(port,()=>{
    console.log(
      "Server started on port:" + port + ". Click on http://localhost:"+port
    );
})

//GIF from Images
const fs = require("fs");
const GIFEncoder = require("gifencoder");
const Canvas = require('canvas');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Calcutta");

function startGIF(cb){
  const time = "2023-07-24T12:00";
  const width = 180;
  const height = 50;
  const color = "#3355AB";
  const bg = "#46D359";
  const encoder = new GIFEncoder(width, height);
  const canvas = new Canvas.Canvas(width, height);
  const ctx = canvas.getContext("2d");
  let target = moment(time);
  let current = moment();
  let difference = target.diff(current);
  let timeResult;
  if (difference <= 0) {
    timeResult = "Countdown over!";
  } else {
    timeResult = moment.duration(difference);
  }
  console.log(difference);
  console.log(Math.ceil(difference/1000));
  let frames = Math.ceil(difference / 1000);
  let imageStream = encoder
    .createReadStream()
    .pipe(fs.createWriteStream("./output/result1.gif"));
  imageStream.on("finish", () => {
    typeof cb === "function" && cb();
  });
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  encoder.start();
    encoder.setRepeat(-1);
    encoder.setDelay(1000);
    encoder.setQuality(10);
    if (typeof timeResult==='object'){
        while(frames!=0){
            console.log(frames);
            let days = Math.floor(timeResult.asDays());
            let hours = Math.floor(timeResult.asHours() - (days*24));
            let minutes = Math.floor(timeResult.asMinutes()-(days*24*60)-(hours*60));
            let seconds = Math.floor(timeResult.asSeconds()-(days*24*60*60)-(hours*60*60)-(minutes*60));

            days = (days.toString().length ==1)?'0'+days:days;
            hours = hours.toString().length == 1 ? "0" + hours : hours;
            minutes = minutes.toString().length == 1 ? "0" + minutes : minutes;
            seconds = seconds.toString().length == 1 ? "0" + seconds : seconds;

            let string = [days,' ',hours,' ',minutes,' ',seconds].join('');

            ctx.beginPath();
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.roundRect(0, 0, width, height, 20);
            ctx.fill();

            ctx.fillStyle = color;
            let fontSize = Math.floor(width / 8) + 'px';
            let fontFamily = 'Courier New';
            ctx.font = [fontSize, fontFamily].join(' ');
            ctx.fillText(string, width/2, height/2.3);
            let fontSize1 = Math.floor(width / 15) + 'px';
            let fontFamily1 = 'Courier New';
            ctx.font = [fontSize1, fontFamily1].join(' ');
            ctx.fillText("Days  Hours  Minutes  Seconds", width/1.9, height/1.2,150);

            encoder.addFrame(ctx);
            timeResult.subtract(1,'seconds');
            frames--;
        }
        ctx.beginPath();
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, 20);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.fillText("Countdown Over!", width / 2, height / 2);
        console.log(frames);
        encoder.addFrame(ctx);
        console.log("last frame added")
        encoder.finish();
    }else{
      console.log("inside else")
      ctx.beginPath();
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 20);
      ctx.fill();
        ctx.fillStyle = color;
        ctx.fillText(timeResult, width / 2, height / 2);

        encoder.addFrame(ctx);
        encoder.finish();
    }
}
app.get("/", (req, res) => {
startGIF(()=>{
    res.sendFile("output/result1.gif", { root: __dirname });
    console.log("In callback");
})
});

