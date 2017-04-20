// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var ipc = require('electron').ipcRenderer;
window.onerror = function(error, url, line) {
    ipc.send('errorInWindow', error);
};

require('./js/canvas.js')
canvas = new Canvas();
canvas.init();

require('./js/logger.js')
logger = new Logger();

logger.logToScreen("foo and bar....");
logger.draw(canvas);