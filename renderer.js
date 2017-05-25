var ipc = require('electron').ipcRenderer;
var electron = require('electron');

window.onerror = function(error, url, line) {
    ipc.send('errorInWindow', error);
    ipc.send('errorInWindow', "In: " + url + ": " + line);
};

var logger = function(obj){
  ipc.send('logToMain', obj);
}

require('./js/canvas.js')
require('./js/elements.js')
require('./js/utils/imageLoader.js')
require('./js/utils/logger.js')
require('./js/utils/utils.js')

elements_version = "0.0.1"

canvas = new Canvas();
canvas.init();

imageLoader = new ImageLoader();
screenLogger = new ScreenLogger();
utils = new Utils();
elements = new Elements(logger);

function handleMouseClicked(event) {
  elements.mouseClicked();
}

function handleKeyUp(event) {
  elements.keyUp(event.keyCode);
}

function handleKeyDown(event) {
  if(!event.repeat) {
    elements.keyDown(event.keyCode);
  }
}

var fpsTimer = 0;
function showFPS(delta) {
  fpsTimer += delta;
  if(fpsTimer > 0.1) {
    var fps = parseInt(1 / delta);
    screenLogger.logToScreen("FPS: " + fps);
    fpsTimer = 0;
  }
}

var lastUpdateTime = Date.now();
var tick = function() {
  var currentTime = Date.now();
  var delta = (currentTime - lastUpdateTime) / 1000;
  showFPS(delta);
  elements.update(delta);
  render();
  lastUpdateTime = currentTime;
}

function render() {
  canvas.clear();
  elements.render();
  screenLogger.render();
}

debugMode = false;
isEditor = false;
var args = electron.remote.getCurrentWindow().mainArgs;
if(args == "editor") {
  isEditor = true;
  inputDialog = document.createElement('input');
  inputDialog.type = 'file';
} else if(args == "game-debug") {
  debugMode = true;
}

utils.updateWindowTitle("");

imageLoader.loadImages(imagesLoaded);
function imagesLoaded() {
  elements.init(elementsInitialized);
}

function elementsInitialized() {
  document.onclick = handleMouseClicked;
  document.onkeyup = handleKeyUp;
  document.onkeydown = handleKeyDown;
  setInterval(tick, (1000 / 60));
}