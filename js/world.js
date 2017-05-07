require('./grid/grid.js')

World = function(logger) {
}

World.prototype.init = function() {
  this.grid = new Grid();
}

World.prototype.update = function(delta) {
}

World.prototype.render = function() {
  this.grid.render();
}

module.exports = World;