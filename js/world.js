require('./grid/grid.js')

World = function() {
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