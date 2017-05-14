require('./grid/grid.js')

World = function(worldData) {
  this.startPos = { x: worldData.startPos.x, y: worldData.startPos.y };
  this.worldData = worldData;
}

World.prototype.init = function(player) {
  this.grid = new Grid(this.worldData);
  player.setStartPos(this.startPos.x, this.startPos.y);
}

World.prototype.update = function(delta, player) {
}

World.prototype.render = function() {
  this.grid.render();
}

module.exports = World;