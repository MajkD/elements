require('./world.js')

log = undefined;
Elements = function(logger) {
  log = logger;
}

Elements.prototype.init = function() {
  this.world = new World();
}

Elements.prototype.update = function(delta) {
  this.world.update(delta);
}

Elements.prototype.render = function() {
  this.world.render();
}

Elements.prototype.mouseClicked = function() {
  this.world.resetPlayer();
}

module.exports = Elements;