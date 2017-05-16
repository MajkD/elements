require('./grid/grid.js')

World = function() {
  this.loadedLevelPath = undefined;
}

World.prototype.initPlayer = function(player) {
  player.setStartPos(this.worldData.startPos.x, this.worldData.startPos.y);
}

World.prototype.loadLevel = function(path, callback = undefined) {
  var fileReader = require('jsonfile')
  var _this = this;
  fileReader.readFile(path, function(err, worldData) {
    if (err) throw err;
    _this.worldData = worldData;
    _this.grid = new Grid(_this.worldData);
    _this.loadedLevelPath = path;
    _this.updateWindowTitle(path.split("/").pop());
    if(callback) {
      callback();
    }
  });
}

World.prototype.updateWindowTitle = function(path) {
  if(isEditor) {
    utils.setWindowTitle("Elements (editor) - " + path);
  }
}

World.prototype.mouseClicked = function(pos) {
  if(this.grid) {
    this.grid.clickTile(pos);
  }
}

World.prototype.generateMapName = function() {
  var path = this.loadedLevelPath.split(".")
  path[0] += Date.now();
  return path.join(".");
}

World.prototype.gatherWorldData = function() {
  return {
    "startPos": { "x": 300, "y": 300 },
    "tileWidth": 32,
    "tileHeight": 32,
    "gridWidth": 30,
    "gridHeight": 20,
    "grid": this.grid.getSaveData()
  }
}

World.prototype.saveMap = function() {
  if(this.loadedLevelPath) {
    var savePath = this.generateMapName(this.loadedLevelPath)
    var fs = require('fs');
    data = this.gatherWorldData();
    var string = JSON.stringify(data, null, '\t');
    fs.writeFile(savePath, string, function(err) {
      if(err) throw err;
      log("map saved");
    })
  }
}

World.prototype.loadMap = function() {
  inputDialog.addEventListener('change', this.mapSelected.bind(this));
  inputDialog.click();
}

World.prototype.mapSelected = function() {
  var file = inputDialog.files[0];
  if(file && file.path) {
    this.loadLevel(file.path);
  }
}

World.prototype.update = function(delta, player) {
}

World.prototype.render = function() {
  if(this.grid) {
    this.grid.render();
  }
}

module.exports = World;