require('./grid/grid.js')

World = function() {
  this.startPos = { x: 300, y: 300 };
  this.collidedTiles = [];
  this.lastCollidedTiles = [];
  this.collisionArea = undefined;
  this.lastCollidedArea = undefined;
}

World.prototype.init = function(player) {
  this.grid = new Grid();
  player.setStartPos(this.startPos.x, this.startPos.y);
}

World.prototype.resetDebugStates = function() {
  this.lastCollidedArea = undefined;
  var length = this.lastCollidedTiles.length;
  for(var index = 0; index < length; index++) {
    this.lastCollidedTiles[index].debugUnmark();
  }
}

World.prototype.setDebugStates = function() {
  this.resetDebugStates();
  this.lastCollidedArea = this.collisionArea;
  this.lastCollidedTiles = this.collidedTiles;
  var length = this.collidedTiles.length;
  for(var index = 0; index < length; index++) {
    this.collidedTiles[index].debugMark();
  }
}

World.prototype.update = function(delta, player) {
  this.updatePlayerCollision(player);
}

World.prototype.updatePlayerCollision = function(player) {
  if(player.isFalling()) {
    this.collisionArea = player.getCollidingFeetArea();
    this.collidedTiles = this.grid.collide(this.collisionArea);
    var length = this.collidedTiles.length;
    if(length > 0) {
      player.onGroundCollision(this.collidedTiles);
      this.setDebugStates();
    }
  }
  if(player.isWalking()) {
    this.collisionArea = player.getCollidingFrontArea();
    this.collidedTiles = this.grid.collide(this.collisionArea);
    var length = this.collidedTiles.length;
    if(length > 0) {
      player.onWalkCollision(this.collidedTiles);
      this.setDebugStates();
    }
  }
}

World.prototype.render = function() {
  this.grid.render();

  if(this.lastCollidedArea) {
    utils.renderSquare(this.lastCollidedArea.pointA, this.lastCollidedArea.pointB, "blue");
  }
  if(this.collisionArea) {
    utils.renderSquare(this.collisionArea.pointA, this.collisionArea.pointB, "red"); 
  }
}

module.exports = World;