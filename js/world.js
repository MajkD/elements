require('./grid/grid.js')

World = function() {
  this.startPos = { x: 300, y: 300 };
  this.collidedTiles = [];
  this.collidedArea = undefined;
}

World.prototype.init = function(player) {
  this.grid = new Grid();
  player.setStartPos(this.startPos.x, this.startPos.y);
}

World.prototype.resetTileStates = function(tiles) {
  var length = tiles.length;
  for(var index = 0; index < length; index++) {
    tiles[index].debugUnmark();
  }
}

World.prototype.update = function(delta, player) {
  this.updatePlayerCollision(player);
}

World.prototype.updatePlayerCollision = function(player) {
  if(player.isFalling()) {
    this.resetTileStates(this.collidedTiles);
    this.collidedArea = player.getCollidingFeetArea();
    this.collidedTiles = this.grid.collide(this.collidedArea);
    var length = this.collidedTiles.length;
    if(length > 0) {
      player.onGroundCollision(this.collidedTiles);
      for(var index = 0; index < length; index++) {
        this.collidedTiles[index].debugMark();
      }
    }
  }
}

World.prototype.render = function() {
  this.grid.render();

  if(this.collidedArea) {
    utils.renderSquare(this.collidedArea.pointA, this.collidedArea.pointB);
  }
}

module.exports = World;