require('../utils/vector.js')

Player = function() {
  this.startPos = new Vector(0, 0);
  this.pos = new Vector(0, 0);
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);

  var img = imageLoader.getImage("player");
  this.dimensions = { "width": img.width, "height": img.height };

  this.collisionOffset = 16;
  // this.slowDo2n

  this.walking = false;
  this.gravity = 0.3;
  this.jumpForce = 3;

  // this.isWalking = true;
  this.walkingDir = 0;
  this.leftPressed = false;
  this.rightPressed = false;



  //--------
  this.walkingSpeed = 0.3;
  this.walkingFriction = 0.07; //Slow down walking
  this.maxMovementVelocity = 0.5;
}

Player.prototype.setStartPos = function(x, y) {
  this.startPos.x = x;
  this.startPos.y = y;
  this.pos.x = x;
  this.pos.y = y;
}

Player.prototype.getCollidingFeetArea = function() {
  pointA = { x: this.pos.x, y: this.pos.y + this.dimensions.height - this.collisionOffset };
  pointB = { x: this.pos.x + this.dimensions.width, y: this.pos.y + this.dimensions.height + this.collisionOffset};
  return { pointA: pointA, pointB: pointB };
}

Player.prototype.onGroundCollision = function(collidedTiles) {
  this.walking = true;
  this.velocity.y = 0;
  var smallestY = Number.MAX_SAFE_INTEGER;
  var numCollidedTiles = collidedTiles.length
  for(var index = 0; index < numCollidedTiles; index++) {
    if(collidedTiles[index].pos.y < smallestY) {
      smallestY = collidedTiles[index].pos.y;
    }
  }
  this.pos.y = smallestY - this.dimensions.height;
}

Player.prototype.update = function(delta) {
  if(!this.walking) {
    this.velocity.y += this.gravity;
  }
  this.updateMovementVelocity();
  this.updatePos(delta);
}

Player.prototype.findWalkingDir = function() {
  if(this.leftPressed) {
    if(this.rightPressed) {
      this.walkingDir = 0;
    } else {
      this.walkingDir = -1;
    }
  } else if(this.rightPressed) {
    this.walkingDir = 1;
  } else {
    this.walkingDir = 0;
  }
}

Player.prototype.updateMovementVelocity = function() {
  this.findWalkingDir();
  if(this.walkingDir != 0) {
    var newVelocity = this.velocity.x + (this.walkingSpeed * this.walkingDir);
    this.velocity.x = utils.clamp(newVelocity, -this.maxMovementVelocity, this.maxMovementVelocity);
  } else {
    this.slowDownMovement();
  }
}

Player.prototype.slowDownMovement = function() {
  if(this.velocity.x < 0) {
    this.velocity.x += this.walkingFriction;
    if(this.velocity.x > 0) {
      this.velocity.x = 0;
    }
  }

  if(this.velocity.x > 0) {
    this.velocity.x -= this.walkingFriction;
    if(this.velocity.x < 0) {
      this.velocity.x = 0;
    }
  }
}

Player.prototype.isFalling = function() {
  return this.velocity.y > 0;
}

Player.prototype.isJumping = function() {
  return this.velocity.y < 0;
}

Player.prototype.onSpacePressed = function() {
  if(!this.isFalling()) {
    this.velocity.y -= this.jumpForce;
    this.walking = false;
  }
}

Player.prototype.onLeftDown = function() {
  this.leftPressed = true;
}

Player.prototype.onRightDown = function() {
  this.rightPressed = true;
}

Player.prototype.onLeftUp = function() {
  this.leftPressed = false;
}

Player.prototype.onRightUp = function() {
  this.rightPressed = false;
}

Player.prototype.updatePos = function(delta) {
  this.pos.x += this.velocity.x * delta;
  this.pos.y += this.velocity.y * delta;
}

Player.prototype.render = function() {
  var img = imageLoader.getImage("player");
  if(this.isJumping()) {
    img = imageLoader.getImage("player_jump");
  }
  canvas.context.drawImage(img, this.pos.x, this.pos.y, img.width, img.height);
}

module.exports = Player;