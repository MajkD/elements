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
  setMainArgs(mainWindow, {args: process.argv});
});

function setMainArgs(mainWindow, arg) {
  mainWindow.mainArgs = []
  for(var index = 2; index < arg.args.length; index++) {
    mainWindow.mainArgs.push(arg.args[index]);
  }
}

var ipc = require('electron').ipcMain;
ipc.on('errorInWindow', function(event, data){
    console.log(data)
});
ipc.on('logToMain', function(event, data){
    console.log(data)
});