const {app, BrowserWindow} = require('electron');

let mainWindow;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1024, height: 720, resizable: false});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  var arg = {args: process.argv}
  mainWindow.mainArgs = arg.args[2];
});

var ipc = require('electron').ipcMain;
ipc.on('errorInWindow', function(event, data){
    console.log(data)
});
ipc.on('logToMain', function(event, data){
    console.log(data)
});