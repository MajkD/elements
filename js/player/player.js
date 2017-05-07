require('../utils/vector.js')

Player = function(x, y) {
  this.pos = new Vector(x, y);
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);

  var img = imageLoader.getImage("player");
  this.dimensions = { "width": img.width, "height": img.height };

  this.falling = true;

  this.gravity = 0.98;
}

Player.prototype.getCollidingFeetArea = function() {
  pointA = { x: this.pos.x, y: this.pos.y + this.dimensions.height };
  pointB = { x: this.pos.x + this.dimensions.width, y: this.pos.y + this.dimensions.height };
  return { pointA: pointA, pointB: pointB };
}

Player.prototype.onGroundCollision = function(collisionPoint) {
  log("Player collision: x: " + collisionPoint.x + " y: " + collisionPoint.y);
  this.falling = false;
  this.velocity.y = 0;
  this.pos.y = collisionPoint.y - this.dimensions.height;
}

Player.prototype.update = function(delta) {
  if(this.falling) {
    this.velocity.y = this.gravity;
  }
  this.updatePos(delta);
}

Player.prototype.updatePos = function(delta) {
  this.pos.x += this.velocity.x * delta;
  this.pos.y += this.velocity.y * delta;
}

Player.prototype.render = function() {
  var img = imageLoader.getImage("player");
  canvas.context.drawImage(img, this.pos.x, this.pos.y, img.width, img.height);
}

module.exports = Player;