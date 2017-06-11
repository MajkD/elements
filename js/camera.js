require('./utils/vector.js')

Camera = function() {
  this.width = 1024;
  this.height = 720;
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
  return utils.rectangleOverlap(bounds, this.getBounds());
}

Camera.prototype.pointOverlap = function(point) {
  var cameraBounds = this.getBounds();
  if(point.x >= cameraBounds.p1.x && point.x <= cameraBounds.p2.x) {
    if(point.y >= cameraBounds.p1.y && point.y <= cameraBounds.p2.y) {
      return true
    } 
  }
  return false;
}

Camera.prototype.getBounds = function() {
  return { p1: { x: this.position.x - (this.width * 0.5), y: this.position.y - (this.height * 0.5) },
           p2: { x: this.position.x + (this.width * 0.5), y: this.position.y + (this.height * 0.5) }}
}

Camera.prototype.renderImage = function(img, xPos, yPos, width, height) {
  var topLeft = this.getBounds().p1;
  canvas.context.drawImage(img, xPos - topLeft.x, yPos - topLeft.y, width, height);
}

Camera.prototype.renderFilledSquare = function(pointA, pointB, color) {
  var topLeft = this.getBounds().p1;
  var p1 = { x: pointA.x - topLeft.x, y: pointA.y - topLeft.y }
  var p2 = { x: pointB.x - topLeft.x, y: pointB.y - topLeft.y }
  
  var width = p2.x - p1.x;
  var height = p2.y - p1.y;
  canvas.context.beginPath();
  canvas.context.fillStyle = color;
  canvas.context.fillRect(p1.x, p1.y, width, height);
  canvas.context.stroke();
}

Camera.prototype.renderSquare = function(pointA, pointB, color) {
  var topLeft = this.getBounds().p1;
  var p1 = { x: pointA.x - topLeft.x, y: pointA.y - topLeft.y }
  var p2 = { x: pointB.x - topLeft.x, y: pointB.y - topLeft.y }

  var width = p2.x - p1.x;
  var height = p2.y - p1.y;
  canvas.context.beginPath();
  canvas.context.lineWidth = "2";
  canvas.context.strokeStyle = color;
  canvas.context.rect(p1.x, p1.y, width, height);
  canvas.context.stroke();
}

Camera.prototype.renderDebug = function() {
  if(debugCamera) {
    var p1 = { x: 0, y: 0 };
    var p2 = { x: this.width, y: this.height };
    this.renderSquare(p1, p2, "green");
  }
}

module.exports = Camera;