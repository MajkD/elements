require('./utils/vector.js')

Camera = function() {
  this.width = 300;
  this.height = 200;
  this.position = { x: 0, y: 0 };
}

Camera.prototype.onKeyPressed = function(key) {
  if(!debugCamera) return;
  var step = 10;
  if (key == 'w') {
    this.position.y -= step;  
  }
  if (key == 's') {
    this.position.y += step;  
  }
  if (key == 'a') {
    this.position.x -= step;  
  }
  if (key == 'd') {
    this.position.x += step;  
  }
}

Camera.prototype.focusOnPlayer = function(player) {
  var playerCenter = player.centerPos();
  this.position.x = playerCenter.x;
  this.position.y = playerCenter.y;
}

Camera.prototype.init = function(player) {
  this.focusOnPlayer(player);
}

Camera.prototype.update = function(player) {
  if(debugCamera && (player.velocity.x == 0 && player.velocity.y == 0)) {
    return;
  }
  this.focusOnPlayer(player);
}

Camera.prototype.boundsOverlap = function(bounds) {
  return true;
}

// The rectangles don't overlap if
    // one rectangle's minimum in some dimension 
    // is greater than the other's maximum in
    // that dimension.

    // bool noOverlap = r1.x1 > r2.x2 ||
    //                  r2.x1 > r1.x2 ||
    //                  r1.y1 > r2.y2 ||
    //                  r2.y1 > r1.y2;

Camera.prototype.pointOverlap = function(point) {
  var cameraBounds = this.calcBounds();
  if(point.x >= cameraBounds.topLeft.x && point.x <= cameraBounds.bottomRight.x) {
    if(point.y >= cameraBounds.topLeft.y && point.y <= cameraBounds.bottomRight.y) {
      return true
    } 
  }
  return false;
}

Camera.prototype.calcBounds = function() {
  return { topLeft: { x: this.position.x - (this.width * 0.5), y: this.position.y - (this.height * 0.5) },
           bottomRight: { x: this.position.x + (this.width * 0.5), y: this.position.y + (this.height * 0.5) }}
}

Camera.prototype.render = function() {
  if(debugCamera) {
    var bounds = this.calcBounds();
    utils.renderSquare(bounds.topLeft, bounds.bottomRight, "green");
  } 
}

module.exports = Camera;