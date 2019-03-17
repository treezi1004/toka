const path = require('path');
const url = require('url');
// IPC Renderer
const { ipcRenderer } = require('electron');
// File System module
const fs = require('fs');
// Dialog module
const {dialog} = require('electron').remote;
const baseDir = String(__dirname).replace(/\\/g, '/').replace('/njs', '');
var timer = 0;
var currentAnim = baseDir + '/img/idle/';
var currentFPS = 0;
var fpsSetting = 15;
var currentIDX = null;
var animIV = 0.7;
var imgIndex = 0;

var constraints = {audio: true};
var stream = null;

function creatStreamSouce(){
  navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream){
    callbStream(mediaStream);
  }).catch(function(err) { console.log(err.name + ": " + err.message); });
}

function callbStream(mediaStream){
  stream = mediaStream;
}

function getStreamData() {
  if(stream != null){
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source = audioCtx.createMediaStreamSource(stream);
    var analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    //source.connect(audioCtx.destination);
    analyser.fftSize = 32;
    var dataArray = new Uint8Array(analyser.fftSize);
    setTimeout(function(){
      analyser.getByteTimeDomainData(dataArray);
      var count = 0;
      for(var i = 0; i < analyser.fftSize; i++){
        if(dataArray[i] != 128 && dataArray[i] != 127 && dataArray[i] != 129) {
          count++;
        }
      }
      changeAnim(count);
    }, 1000);
  }
}

function changeAnim(count) {
  if(count > 2){
    currentAnim = baseDir + '/img/talk/';
    imgIndex = 0;
  } else {
    currentAnim = baseDir + '/img/idle/';
    imgIndex = 0;
  }
}

function getFPS(directory){
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    callbFPS(files.length);
  });
}

function callbFPS(fileLength) {
  currentFPS = fileLength;
}

function doAnimation(){
  getFPS(currentAnim);
  fs.readdir(currentAnim, (err, files) => {
    if (err) throw err;
    imgIndex = Math.ceil(timer / (animIV * 100 / currentFPS)) - 1;
    if(imgIndex < 0) imgIndex = 0;
    if(currentIDX != imgIndex && files[imgIndex] != undefined){
      fs.access(currentAnim + files[imgIndex], fs.F_OK, (err) => {
        if (err) {
          //console.error(err);
          return;
        }
        document.getElementById('animImg').setAttribute('src', currentAnim + files[imgIndex]);
      })
    }
    callbDoAnim(imgIndex);
  });
}

function callbDoAnim(imgIndex){
  currentIDX = imgIndex;
}

function incrementTimer() {
  if (animIV > 60 || animIV < 0) animIV = 1;
  timer += 1;
  doAnimation();
  if (timer > animIV * 100) timer = 0;
}

var animClock = setInterval(incrementTimer, 10);
var audioClock = setInterval(getStreamData, 1000);
creatStreamSouce();
