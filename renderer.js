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
data_path = __dirname + "/data/"

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
  if(debugCamera) {
    if(event.keyCode == 87 ||
       event.keyCode == 65 ||
       event.keyCode == 83 ||
       event.keyCode == 68) {
      elements.keyDown(event.keyCode);
    }
  }

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

debugCamera = false;
debugGame = false;
isEditor = false;
var args = electron.remote.getCurrentWindow().mainArgs;
if(args.indexOf("editor") != -1) {
  isEditor = true;
  inputDialog = document.createElement('input');
  inputDialog.type = 'file';
} 
if(args.indexOf("debug-game") != -1) {
  debugGame = true;
}
if(args.indexOf("debug-camera") != -1) {
  debugCamera = true;
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