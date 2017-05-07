require('./tile.js')

Grid = function() {
  this.tileWidth = 32;
  this.tileHeight = 32;
  this.numTilesX = 30;
  this.numTilesY = 20;
  this.tiles = [];
  this.initGrid();
}

Grid.prototype.initGrid = function() {
  for(var x = 0; x < this.numTilesX; x++) {
    for(var y = 0; y < this.numTilesY; y++) {
      var xPos = x * this.tileWidth;
      var yPos = y * this.tileHeight;
      var index = (x * this.numTilesX) + y;
      this.tiles[index] = new Tile(this.tileWidth, this.tileHeight, xPos, yPos);
    }
  }
}

Grid.prototype.render = function() {
  var length = this.tiles.length;
  for(var x = 0; x < this.numTilesX; x++) {
    for(var y = 0; y < this.numTilesY; y++) {
      var index = (x * this.numTilesX) + y;
      this.tiles[index].render();
    }
  }
}

module.exports = Grid;