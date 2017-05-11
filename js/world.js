require('./grid/grid.js')

World = function(worldData) {
  this.startPos = { x: worldData.startPos.x, y: worldData.startPos.y };
  this.worldData = worldData;
  // Debug
  this.debugCollisionAreas = [];
  this.debugCollidedTiles = [];
  this.debugCollidedArea = undefined;
}

World.prototype.init = function(player) {
  this.grid = new Grid(this.worldData);
  player.setStartPos(this.startPos.x, this.startPos.y);
}

World.prototype.resetDebugTileStates = function() {
  var length = this.debugCollidedTiles.length;
  for(var index = 0; index < length; index++) {
    this.debugCollidedTiles[index].debugUnmark();
  }
}

World.prototype.setDebugTileStates = function() {
  var length = this.debugCollidedTiles.length;
  for(var index = 0; index < length; index++) {
    this.debugCollidedTiles[index].debugMark();
  }
}

World.prototype.update = function(delta, player) {
  this.updatePlayerCollision(player);
}

World.prototype.updatePlayerCollision = function(player) {
  if(player.isFalling()) {
    var collisionArea = player.getCollidingFeetArea();
    var collidedTiles = this.grid.collide(collisionArea);
    var length = collidedTiles.length;
    if(length > 0) {
      player.onGroundCollision(collidedTiles);
      if(debugMode) {
        this.resetDebugTileStates();
        this.debugCollidedTiles = collidedTiles;
        this.setDebugTileStates();
        this.debugCollidedArea = collisionArea;
      }
    }
    if(debugMode) {
      this.debugCollisionAreas.push(collisionArea);
    }
  }
  if(player.isWalking()) {
    var collisionArea = player.getCollidingFrontArea();
    var collidedTiles = this.grid.collide(collisionArea);
    var length = collidedTiles.length;
    if(length > 0) {
      player.onWalkCollision(collidedTiles);
      if(debugMode) {
        this.resetDebugTileStates();
        this.debugCollidedTiles = collidedTiles;
        this.setDebugTileStates();
        this.debugCollidedArea = collisionArea;
      }
    }
    if(debugMode) {
      this.debugCollisionAreas.push(collisionArea);
    }
  }
}

World.prototype.render = function() {
  this.grid.render();

  if(debugMode) {
    if(this.debugCollisionAreas.length > 0) {
      for(var index = 0; index < this.debugCollisionAreas.length; index++) {
        var area = this.debugCollisionAreas[index];
        utils.renderFilledSquare(area.pointA, area.pointB, "red");
      }
      this.debugCollisionAreas = [];
    }
    if(this.debugCollidedArea) {
      utils.renderFilledSquare(this.debugCollidedArea.pointA, this.debugCollidedArea.pointB, "blue");
    }
  }
}

module.exports = World;