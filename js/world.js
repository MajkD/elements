require('./grid/grid.js')

World = function() {
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
    _this.updateWindowTitle(path);
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

World.prototype.saveMap = function() {
  log("save map")
}

World.prototype.loadMap = function() {
  inputDialog.addEventListener('change', this.mapSelected.bind(this));
  inputDialog.click();
}

World.prototype.mapSelected = function() {
  var file = inputDialog.files[0];
  this.loadLevel(file.path);
}

World.prototype.update = function(delta, player) {
}

World.prototype.render = function() {
  if(this.grid) {
    this.grid.render();
  }
}

module.exports = World;