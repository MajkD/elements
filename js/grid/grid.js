require('./tile.js')

Grid = function() {
  this.tileWidth = 32;
  this.tileHeight = 32;
  this.numTilesX = 30;
  this.numTilesY = 20;
  this.grid = [];
  this.tiles = [];
  this.initGrid();
}

Grid.prototype.makeAHoleInTheWorld = function(x, y) {
  var offset = 4;
  if(x >= offset && y >= offset && (x < this.numTilesX - offset) && (y < this.numTilesY - offset)) {
    return false;
  }
  return true;
}

Grid.prototype.initGrid = function() {
  for(var x = 0; x < this.numTilesX; x++) {
    for(var y = 0; y < this.numTilesY; y++) {
      if(this.makeAHoleInTheWorld(x, y)) {
        var xPos = x * this.tileWidth;
        var yPos = y * this.tileHeight;
        var index = (x * this.numTilesX) + y;
        var tile = new Tile(this.tileWidth, this.tileHeight, { x: xPos, y: yPos } );
        this.tiles.push(tile);
        this.grid[index] = this.tiles.length - 1;
      }
    }
  }
}

Grid.prototype.coordinatesInWorldBounds = function(x, y) {
  if(x >= 0 && x < this.numTilesX && y >= 0 && y < this.numTilesY) {
    return true;
  }
  return false;
}

Grid.prototype.collide = function(collidingArea) {
  var x = parseInt(collidingArea.pointA.x / this.tileWidth);
  var y = parseInt(collidingArea.pointA.y / this.tileHeight);
  if(this.coordinatesInWorldBounds(x, y)) {
    var index = (x * this.numTilesX) + y;
    if(this.grid[index]) {
      return { point: { x: collidingArea.pointA.x, y: collidingArea.pointA.y},
               tile: this.tiles[this.grid[index]] };
    }
  }
  return undefined;
}

Grid.prototype.render = function() {
  var length = this.tiles.length;
  for(var index = 0; index < length; index++) {
    this.tiles[index].render();
  }
}

module.exports = Grid;