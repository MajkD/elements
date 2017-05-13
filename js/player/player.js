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
  this.gravity = 98.0;
  this.jumpForce = 1500;
  // Walking
  this.walkingAcceleration = 10000;
  this.walkingFriction = 150; //Slow down walking
  this.maxMovementVelocity = 500;
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

Player.prototype.getCollidingHeadArea = function() {
  pointA = { x: this.pos.x + this.collisionSideOffset, y: this.pos.y - this.collisionOffset };
  pointB = { x: this.pos.x + this.dimensions.width - this.collisionSideOffset, y: this.pos.y + this.collisionOffset };
  return { pointA: pointA, pointB: pointB };
}

Player.prototype.getCollidingFeetArea = function() {
  pointA = { x: this.pos.x + this.collisionSideOffset, y: this.pos.y + this.dimensions.height - this.collisionOffset };
  pointB = { x: this.pos.x + this.dimensions.width - this.collisionSideOffset, y: this.pos.y + this.dimensions.height + this.collisionOffset };
  return { pointA: pointA, pointB: pointB };
}

Player.prototype.getCollidingFrontArea = function() {
  if(this.velocity.x < 0) {
    pointA = { x: this.pos.x, y: this.pos.y + this.collisionSideOffset };
    pointB = { x: this.pos.x + this.collisionOffset, y: this.pos.y + this.dimensions.height - this.collisionSideOffset };
  }
  if(this.velocity.x > 0) {
    pointA = { x: this.pos.x + this.dimensions.width - this.collisionOffset, y: this.pos.y + this.collisionSideOffset };
    pointB = { x: this.pos.x + this.dimensions.width, y: this.pos.y + this.dimensions.height - this.collisionSideOffset };
  }
  return { pointA: pointA, pointB: pointB }; 
}

Player.prototype.onRoofCollision = function(collidedTiles) {
  if(this.velocity.y < 0){
    this.velocity.y = 0;
  }
  var biggestY = -Number.MAX_SAFE_INTEGER;
  var numCollidedTiles = collidedTiles.length
  for(var index = 0; index < numCollidedTiles; index++) {
    var tile = collidedTiles[index];
    if(tile.pos.y + tile.height > biggestY) {
      biggestY = tile.pos.y + tile.height;
    }
  }
  this.pos.y = biggestY;
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
  var prevVelocity = this.velocity.x;
  this.collidedTiles = collidedTiles;
  this.velocity.x = 0;
  this.walkingDir = 0;
  if(prevVelocity < 0) {
    this.pos.x = this.getRightmostCollidedPoint();
  } else if (prevVelocity > 0) {
    this.pos.x = this.getLeftmostCollidedPoint() - this.dimensions.width;
  }
}

Player.prototype.update = function(delta) {
  if(this.movementState == MS_Air) {
    this.velocity.y += this.gravity;
  }
  this.updateMovementVelocity(delta);
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

Player.prototype.updateMovementVelocity = function(delta) {
  this.setWalkingDir();
  if(this.walkingDir != 0) {
    var newVelocity = this.velocity.x + (delta * this.walkingAcceleration * this.walkingDir);
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
  return this.velocity.x != 0;
}

Player.prototype.isFalling = function() {
  return this.velocity.y > 0;
}

Player.prototype.isJumping = function() {
  return this.velocity.y < 0;
}

Player.prototype.onSpacePressed = function() {
  if(this.movementState == MS_Walk) {
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
  if(debugMode) {
    var a = { x: this.pos.x, y: this.pos.y };
    var b = { x: this.pos.x + this.dimensions.width, y: this.pos.y + this.dimensions.height };
    utils.renderSquare(a, b, "white");
    // for(var index = 0; index < this.collidedTiles.length; index++) {
    //   var tile = this.collidedTiles[index];
    //   var pointA = { x: tile.x, y: tile.y };
    //   var pointB = { x: tile.x + tile.width, y: tile.y + tile.height };
    //   utils.renderSquare(pointA, pointB, "yellow");
    // }
  } else {
    var img = imageLoader.getImage("player");
    if(this.isJumping()) {
      img = imageLoader.getImage("player_jump");
    }
    canvas.context.drawImage(img, this.pos.x, this.pos.y, img.width, img.height);
  }
}

module.exports = Player;