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

World.prototype.resetPlayer = function() {
  log("reset player - TEMP");
  this.player.pos.x = this.player.startPos.x;
  this.player.pos.y = this.player.startPos.y - this.player.dimensions.height;
  this.player.falling = true;
  var length = this.grid.tiles.length;
  for(var index = 0; index < length; index++) {
    this.grid.tiles[index].debugUnmark();
  }
}

World.prototype.update = function(delta) {
  this.player.update(delta);
  this.updatePlayerCollision();
}

World.prototype.updatePlayerCollision = function() {
  if(this.player.falling) {
    var collidingArea = this.player.getCollidingFeetArea();
    var collidedTile = this.grid.collide(collidingArea);
    if(collidedTile) {
      this.player.onGroundCollision(collidedTile);
      collidedTile.debugMark();
    }
  }
}

World.prototype.render = function() {
  this.grid.render();
  this.player.render();
}

module.exports = World;