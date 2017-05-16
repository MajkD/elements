require('./tile.js')

Grid = function(worldData) {
  this.tileWidth = worldData.tileWidth;
  this.tileHeight = worldData.tileHeight;
  this.numTilesX = worldData.gridWidth;
  this.numTilesY = worldData.gridHeight;
  this.loadedGrid = worldData.grid;
  this.grid = [];
  this.tiles = [];
  this.initGrid();
}

Grid.prototype.getSaveData = function() {
  var saveGrid = [];
  for(var x = 0; x < this.numTilesX; x++) {
    saveGrid[x] = [];
    for(var y = 0; y < this.numTilesY; y++) {
      var index = (x * this.numTilesX) + y;
      // log("index: " + index);
      if(this.tiles[this.grid[index]]) {
        saveGrid[x][y] = 1;  
      } else {
        // log("node tile on index: " + index);
        saveGrid[x][y] = 0;
      }
      // log("------")
    }
  }
  // log(saveGrid)
  return saveGrid;
}

Grid.prototype.initGrid = function() {
  for(var x = 0; x < this.numTilesX; x++) {
    for(var y = 0; y < this.numTilesY; y++) {
      if(this.loadedGrid[x][y] == 1) {
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
  var x1 = parseInt(collidingArea.pointA.x / this.tileWidth);
  var y1 = parseInt(collidingArea.pointA.y / this.tileHeight);
  var x2 = parseInt(collidingArea.pointB.x / this.tileWidth);
  var y2 = parseInt(collidingArea.pointB.y / this.tileHeight);

  var collidingTiles = [];
  for(var x = x1; x <= x2; x++) {
    for(var y = y1; y <= y2; y++) {
      if(this.coordinatesInWorldBounds(x, y)) {
        var index = (x * this.numTilesX) + y;
        if(this.grid[index]) {
          collidingTiles.push(this.tiles[this.grid[index]]);
        }
      }
    }
  }
  return collidingTiles;
}

Grid.prototype.removeTileCyclic = function(index) {
  var lastTile = this.tiles[this.tiles.length-1];
  var x = parseInt(lastTile.pos.x / this.tileWidth);
  var y = parseInt(lastTile.pos.y / this.tileHeight);
  var lastTileGridIndex = (x * this.numTilesX) + y;
  this.grid[lastTileGridIndex] = this.grid[index];
  this.tiles[this.grid[index]] = this.tiles[this.tiles.length-1];
  this.tiles.pop();
  this.grid[index] = undefined;
}

Grid.prototype.clickTile = function(pos) {
  var x = parseInt(pos.x / this.tileWidth);
  var y = parseInt(pos.y / this.tileHeight);
  var index = (x * this.numTilesX) + y;
  if(this.grid[index]) {
    this.removeTileCyclic(index);
  } else {
    var tilePos = { x: x * this.tileWidth, y: y * this.tileHeight }
    var tile = new Tile(this.tileWidth, this.tileHeight, tilePos);
    this.tiles.push(tile);
    var index = (x * this.numTilesX) + y;
    this.grid[index] = this.tiles.length - 1;
  }
}

Grid.prototype.render = function() {
  var length = this.tiles.length;
  for(var index = 0; index < length; index++) {
    this.tiles[index].render();
  }
}

module.exports = Grid;