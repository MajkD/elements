require('./world.js')
require('./player/player.js')

log = undefined;
Elements = function(logger) {
  log = logger;
}

Elements.prototype.init = function() {
  this.world = new World();
  this.player = new Player();
  this.world.init(this.player);
}

Elements.prototype.update = function(delta) {
  this.player.update(delta);
  this.world.update(delta, this.player);
}

Elements.prototype.render = function() {
  this.world.render();
  this.player.render();
}

Elements.prototype.mouseClicked = function() {
}

Elements.prototype.keyDown = function(keyCode) {
  if(keyCode == 37) {
    this.player.onLeftDown();
  }
  if(keyCode == 39) {
    this.player.onRightDown();
  }
}

Elements.prototype.keyUp = function(keyCode) {
  if(keyCode == 37) {
    this.player.onLeftUp();
  }
  if(keyCode == 39) {
    this.player.onRightUp();
  }
  if(keyCode == 32) {
    this.player.onSpacePressed();
  }
}

module.exports = Elements;