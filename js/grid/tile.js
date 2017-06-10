Tile = function(width, height, pos) {
  this.width = width;
  this.height = height;
  this.pos = pos;

  this.marked = false;
  this.timeMarked = 0;
}

Tile.prototype.debugMark = function(collisionArea) {
  this.collisionArea = collisionArea;
  this.marked = true;
  this.timeMarked = Date.now();
}

Tile.prototype.debugUnmark = function() {
  this.marked = false;
}

Tile.prototype.getMiddlePoint = function() {
  return { x: this.pos.x + (this.width * 0.5), y: this.pos.y + (this.height * 0.5) }
}

Tile.prototype.render = function() {
  var img = imageLoader.getImage("tile");

  if(debugGame) {
    if(this.marked) {
      var now = Date.now();
      var diff = now - this.timeMarked;
      if(diff > 1000) {
        this.marked = false;
      }
    }

    if(this.marked) {
      if(diff <= 250) {
        img = imageLoader.getImage("tile_mark_1");
      }
      else if(diff > 250 && diff <= 500) {
        img = imageLoader.getImage("tile_mark_2");
      }
      else if(diff > 500 && diff <= 750) {
        img = imageLoader.getImage("tile_mark_3");
      } else {
        img = imageLoader.getImage("tile_mark_4");
      }

      if(this.collisionArea) {
        utils.renderFilledSquare(this.collisionArea.pointA, this.collisionArea.pointB, "blue");
      }
    }
  }
  canvas.context.drawImage(img, this.pos.x, this.pos.y, img.width, img.height);
}

module.exports = Tile;