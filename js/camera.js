require('./utils/vector.js')

Camera = function() {
  // this.width = 1024;
  // this.height = 720;

  this.width = 500;
  this.height = 400;
  this.cameraRenderOffset = { x: 0, y: 0 };
  this.position = { x: 0, y: 0 };
  this.zoom = 1;
  this.maxZoom = 2;
  this.minZoom = 0.5;
}

Camera.prototype.onKeyPressed = function(key) {
  if(!debugCamera) return;
  var step = 10;
  var zoomStep = 0.1;
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
  if (key == 'q') {
    this.zoom = utils.clamp(this.zoom - zoomStep, this.minZoom, this.maxZoom);
    log(this.zoom);
  }
  if (key == 'e') {
    this.zoom = utils.clamp(this.zoom + zoomStep, this.minZoom, this.maxZoom);
    log(this.zoom);
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

Camera.prototype.update = function(player, world) {
  if(debugCamera && (player.velocity.x == 0 && player.velocity.y == 0)) {
    return;
  }
  this.focusOnPlayer(player);
  // log(world);
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

Camera.prototype.getTopLeft = function() {
  var topLeft = this.getBounds().p1;
  topLeft.x -= this.cameraRenderOffset.x;
  topLeft.y -= this.cameraRenderOffset.y;
  return topLeft;
}

Camera.prototype.getScale = function() {
  return this.maxZvalue - this.position.z;
}

Camera.prototype.getZoom = function() {
  return this.zoom;
}

Camera.prototype.renderImage = function(img, xPos, yPos, width, height) {
  var cameraTopLeft = this.getTopLeft();
  var scale = this.getZoom();
  var imageTopLeft =  { x: (xPos - cameraTopLeft.x) * scale, y: (yPos - cameraTopLeft.y) * scale };
  canvas.context.drawImage(img, imageTopLeft.x, imageTopLeft.y, width * scale, height * scale);
}

Camera.prototype.renderFilledSquare = function(pointA, pointB, color) {
  var topLeft = this.getTopLeft();
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
  var topLeft = this.getTopLeft();
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