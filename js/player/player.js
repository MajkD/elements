require('../utils/vector.js')

var MS_Air = 0;
var MS_Walk = 1;

Player = function() {
  this.startPos = new Vector(0, 0);
  this.pos = new Vector(0, 0);
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);

  var img = imageLoader.getImage("player");
  this.dimensions = { "width": img.width, "height": img.height };

  this.collisionOffset = 16;
  this.collisionSideOffset = 8;
  this.movementState = MS_Air;

  this.walkingDir = 0;
  this.leftPressed = false;
  this.rightPressed = false;
  this.collidedTiles = [];
  
  // Jumping
  this.gravity = 0.3;
  this.jumpForce = 3;
  // Walking
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

Player.prototype.getMiddlePoint = function() {
  return { x: this.pos.x + (this.dimensions.width * 0.5), y: this.pos.y + (this.dimensions.height * 0.5) }
}

Player.prototype.getCollidingFeetArea = function() {
  pointA = { x: this.pos.x + this.collisionSideOffset, y: this.pos.y + this.dimensions.height - this.collisionOffset };
  pointB = { x: this.pos.x + this.dimensions.width - this.collisionSideOffset, y: this.pos.y + this.dimensions.height + this.collisionOffset };
  return { pointA: pointA, pointB: pointB };
}

Player.prototype.getCollidingFrontArea = function(dir = undefined) {
  var direction = (dir == undefined) ? this.walkingDir : dir;
  if(this.walkingDir == -1) {
    pointA = { x: this.pos.x, y: this.pos.y + this.collisionSideOffset };
    pointB = { x: this.pos.x + this.collisionOffset, y: this.pos.y + this.dimensions.height - this.collisionSideOffset };
  }
  if(this.walkingDir == 1) {
    pointA = { x: this.pos.x + this.dimensions.width - this.collisionOffset, y: this.pos.y + this.collisionSideOffset };
    pointB = { x: this.pos.x + this.dimensions.width, y: this.pos.y + this.dimensions.height - this.collisionSideOffset };
  }
  return { pointA: pointA, pointB: pointB }; 
}

Player.prototype.onGroundCollision = function(collidedTiles) {
  this.movementState = MS_Walk;
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

Player.prototype.onWalkCollision = function(collidedTiles) {
  var prevWalkingDir = this.walkingDir;
  this.collidedTiles = collidedTiles;
  this.velocity.x = 0;
  this.walkingDir = 0;
  this.leftPressed = false;
  this.rightPressed = false;

  if(prevWalkingDir == -1) {
    this.pos.x = this.getRightmostCollidedPoint();
  } else if (prevWalkingDir == 1) {
    this.pos.x = this.getLeftmostCollidedPoint() - this.dimensions.width;
  }
}

Player.prototype.update = function(delta) {
  if(this.movementState == MS_Air) {
    this.velocity.y += this.gravity;
  }
  this.updateMovementVelocity();
  this.updatePos(delta)
}

Player.prototype.setWalkingDir = function() {
  if(this.leftPressed) {
    if(this.rightPressed) {
      this.walkingDir = 0;
    } else {
      if (this.allowedMoveInDirection(-1)) {
        this.walkingDir = -1;
      }
    }
  } else if(this.rightPressed) {
    if (this.allowedMoveInDirection(1)) {
      this.walkingDir = 1;
    }
  } else {
    this.walkingDir = 0;
  }
}

Player.prototype.getRightmostCollidedPoint = function() {
  var biggestX = -Number.MAX_SAFE_INTEGER;
  var numCollidedTiles = this.collidedTiles.length
  for(var index = 0; index < numCollidedTiles; index++) {
    var tile = this.collidedTiles[index];
    if(tile.getMiddlePoint().x < this.getMiddlePoint().x) { //Only care if tile is to the left of player
      var x = tile.pos.x + tile.width;
      if(x > biggestX) {
        biggestX = x;
      }
    }
  }
  return biggestX;
}

Player.prototype.getLeftmostCollidedPoint = function() {
  var smallestX = Number.MAX_SAFE_INTEGER;
  var numCollidedTiles = this.collidedTiles.length
  for(var index = 0; index < numCollidedTiles; index++) {
    var tile = this.collidedTiles[index];
    if(tile.getMiddlePoint().x > this.getMiddlePoint().x) { //Only care if tile is to the right of player
      if(tile.pos.x < smallestX) {
        smallestX = tile.pos.x;
      }
    }
  }
  return smallestX;
}

Player.prototype.allowedMoveInDirection = function(dir) {
  if(this.collidedTiles.length == 0) {
    return true;
  }
  log("remove collided tiles")
  if(dir == -1) {
    if(this.pos.x >= this.getRightmostCollidedPoint()) {
      return true;
    }
  }
  if(dir == 1) {
    var foobar = this.pos.x + this.dimensions.width;
    if(this.pos.x + this.dimensions.width <= this.getLeftmostCollidedPoint()) {
      return true;
    }
  }
  return false;
}

Player.prototype.updateMovementVelocity = function() {
  this.setWalkingDir();
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

Player.prototype.isWalking = function() {
  return this.walkingDir != 0;
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
    this.movementState = MS_Air;
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