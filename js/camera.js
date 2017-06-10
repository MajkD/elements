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

Camera.prototype.inCameraView = function(bounds) {
  return utils.rectangleOverlap(bounds, this.calcBounds());
}

Camera.prototype.pointOverlap = function(point) {
  var cameraBounds = this.calcBounds();
  if(point.x >= cameraBounds.p1.x && point.x <= cameraBounds.p2.x) {
    if(point.y >= cameraBounds.p1.y && point.y <= cameraBounds.p2.y) {
      return true
    } 
  }
  return false;
}

Camera.prototype.calcBounds = function() {
  return { p1: { x: this.position.x - (this.width * 0.5), y: this.position.y - (this.height * 0.5) },
           p2: { x: this.position.x + (this.width * 0.5), y: this.position.y + (this.height * 0.5) }}
}

Camera.prototype.render = function() {
  if(debugCamera) {
    var bounds = this.calcBounds();
    utils.renderSquare(bounds.p1, bounds.p2, "green");
  } 
}

module.exports = Camera;