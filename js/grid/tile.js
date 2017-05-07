Tile = function(width, height, pos) {
  this.width = width;
  this.height = height;
  this.pos = pos;

  this.marked = false;
}

Tile.prototype.debugMark = function() {
  this.marked = true;
}

Tile.prototype.render = function() {
  var img = imageLoader.getImage("tile");
  if(this.marked) {
    img = imageLoader.getImage("tile_mark");  
  }
  canvas.context.drawImage(img, this.pos.x, this.pos.y, img.width, img.height);
}

module.exports = Tile;