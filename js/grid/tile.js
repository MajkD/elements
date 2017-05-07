Tile = function(width, height, xPos, yPos) {
  this.width = width;
  this.height = height;
  this.xPos = xPos;
  this.yPos = yPos;
}

Tile.prototype.render = function() {
  canvas.context.drawImage(imageLoader.getTileImage(), this.xPos, this.yPos, this.width, this.height);
}

module.exports = Tile;