require('./grid/grid.js')
require('./player/player.js')

World = function() {
  this.startPos = { x: 300, y: 300 };
  this.init();
}

World.prototype.init = function() {
  this.grid = new Grid();
  this.player = new Player(this.startPos.x, this.startPos.y);
}

World.prototype.update = function(delta) {
  this.updatePlayerCollision();
  this.player.update(delta);
}

World.prototype.updatePlayerCollision = function() {
  var collidingArea = this.player.getCollidingFeetArea();
  var collision = this.grid.collide(collidingArea);
  if(collision) {
    this.player.onGroundCollision(collision.point);
    collision.tile.debugMark();
  }
}

World.prototype.render = function() {
  this.grid.render();
  this.player.render();
}

module.exports = World;