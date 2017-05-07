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
        var tile = new Tile(this.tileWidth, this.tileHeight, xPos, yPos);
        this.tiles.push(tile);
        this.grid[index] = this.tiles.length - 1;
      }
    }
  }
}

Grid.prototype.getTile = function(index) {
  return this.tiles[index];
}

Grid.prototype.render = function() {
  var length = this.tiles.length;
  for(var index = 0; index < length; index++) {
    this.tiles[index].render();
  }
}

module.exports = Grid;