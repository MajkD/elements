// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var ipc = require('electron').ipcRenderer;
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

canvas = new Canvas();
canvas.init();

imageLoader = new ImageLoader();
logger = new Logger();

elements = new Elements(logger);
elements.init();

var fpsTimer = 0;
function showFPS(delta) {
  fpsTimer += delta;
  if(fpsTimer > 100) {
    var fps = parseInt(1000 / delta)
    logger.logToScreen("FPS: " + fps);
    fpsTimer = 0;
  }
}

var lastUpdateTime = Date.now();
var tick = function() {
  var currentTime = Date.now();
  var delta = currentTime - lastUpdateTime;
  showFPS(delta);
  elements.update(delta);
  render();
  lastUpdateTime = currentTime;
}

function render() {
  canvas.clear();
  elements.render();
  logger.render();
}

imageLoader.loadImages(imagesLoaded);
function imagesLoaded() {
  setInterval(tick, (1000 / 60));
}

