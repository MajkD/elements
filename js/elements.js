require('./world.js')
require('./player/player.js')

log = undefined;
Elements = function(logger) {
  log = logger;
}

Elements.prototype.init = function(onInitFinished, isEditor) {
  this.isEditor = isEditor;
  this.onInitCallback = onInitFinished;
  var fileReader = require('jsonfile');
  var _this = this;
  fileReader.readFile("./data/world.json", function(err, worldData) {
    if (err) throw err;
    _this.worldDataLoaded(worldData);
  });
}

Elements.prototype.worldDataLoaded = function(worldData) {
  this.world = new World(worldData);
  if(!this.isEditor) {
    this.player = new Player();
  }
  this.world.init(this.player);
  this.onInitCallback();
}

Elements.prototype.update = function(delta) {
  this.world.update(delta, this.player);
  if(this.isEditor) return;
  this.player.update(delta, this.world.grid);
}

Elements.prototype.render = function() {
  this.world.render();
  if(this.isEditor) return;
  this.player.render();
}

Elements.prototype.mouseClicked = function() {
  if(this.isEditor) {
    this.world.mouseClicked({x: event.clientX, y: event.clientY})
  }
}

Elements.prototype.keyDown = function(keyCode) {
  if(this.isEditor) return;

  if(keyCode == 37) {
    this.player.onLeftDown();
  }
  if(keyCode == 39) {
    this.player.onRightDown();
  }
  if(keyCode == 32) {
    this.player.onSpacePressed();
  }
}

Elements.prototype.keyUp = function(keyCode) {
  if(this.isEditor) return;

  if(keyCode == 37) {
    this.player.onLeftUp();
  }
  if(keyCode == 39) {
    this.player.onRightUp();
  }
}

module.exports = Elements;