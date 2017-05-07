require('./world.js')

log = undefined;
Elements = function(logger) {
  log = logger;
}

Elements.prototype.init = function() {
  this.world = new World();
  this.world.init();
}

Elements.prototype.update = function(delta) {
  this.world.update(delta);
}

Elements.prototype.render = function() {
  canvas.clear();
  this.world.render();
}

module.exports = Elements;