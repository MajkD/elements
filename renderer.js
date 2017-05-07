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

canvas = new Canvas();
canvas.init();

imageLoader = new ImageLoader();

elements = new Elements(logger);
elements.init();

var lastUpdateTime = Date.now();
var tick = function() {
  var currentTime = Date.now();
   elements.update((currentTime - lastUpdateTime) / 1000.0);
   elements.render();
   lastUpdateTime = currentTime;
}

imageLoader.loadImages(imagesLoaded);
function imagesLoaded() {
  setInterval(tick, (1000 / 60));
}

