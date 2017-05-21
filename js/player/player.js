require('../utils/vector.js')

var MS_Air = 0;
var MS_Walk = 1;

Player = function(playerData) {
  this.startPos = new Vector(0, 0);
  this.pos = new Vector(0, 0);
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);

  this.movementState = MS_Air;
  this.walkingDir = 0;
  this.leftPressed = false;
  this.rightPressed = false;

  // Image
  var img = imageLoader.getImage(playerData.image);
  this.dimensions = { "width": img.width, "height": img.height };  
  // Collision
  this.collisionOffset = playerData.collisionOffset;
  this.collisionSideOffset = playerData.collisionSideOffset;
  // Jumping
  this.gravity = playerData.gravity;
  this.jumpForce = playerData.jumpForce;
  // Walking
  this.walkingAcceleration = playerData.walkingAcceleration;
  this.walkingFriction = playerData.walkingFriction;
  this.maxMovementVelocity = playerData.maxMovementVelocity;
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
  this.velocity.x = 0;
  this.walkingDir = 0;
  if(prevVelocity < 0) {
    this.pos.x = this.getRightmostCollidedPoint(collidedTiles);
  } else if (prevVelocity > 0) {
    this.pos.x = this.getLeftmostCollidedPoint(collidedTiles) - this.dimensions.width;
  }
}

Player.prototype.update = function(delta, grid) {
  if(this.movementState == MS_Air) {
    this.velocity.y += this.gravity;
  }
  this.updateMovementVelocity(delta);
  this.updatePos(delta)
  this.playerWorldCollision(grid);
}

Player.prototype.markCollidedTiles = function(collidedTiles, collisionArea) {
  var length = collidedTiles.length;
  for(var index = 0; index < length; index++) {
    collidedTiles[index].debugMark(collisionArea);
  }
}

Player.prototype.playerWorldCollision = function(grid) {
  this.jumpingCollision(grid);
  this.fallingCollision(grid);
  this.walkingCollision(grid);
}

Player.prototype.fallingCollision = function(grid) {
  if(!this.isFalling()) return;
  var collisionArea = this.getCollidingFeetArea();
  var collidedTiles = grid.collide(collisionArea);
  if(collidedTiles.length > 0) {
    if(debugMode) {
      this.markCollidedTiles(collidedTiles, collisionArea);
    }
    this.onGroundCollision(collidedTiles);
  }
}

Player.prototype.walkingCollision = function(grid) {
  if(!this.isWalking()) return;
  var collisionArea = this.getCollidingFrontArea();
  var collidedTiles = grid.collide(collisionArea);
  if(collidedTiles.length > 0) {
    if(debugMode) {
      this.markCollidedTiles(collidedTiles, collisionArea);
    }
    this.onWalkCollision(collidedTiles);
  }

  var collisionArea = this.getCollidingFeetArea();
  var collidedTiles = grid.collide(collisionArea);
  if(collidedTiles.length == 0) {
     this.movementState = MS_Air;
  }
}

Player.prototype.jumpingCollision = function(grid) {
  if(!this.isJumping()) return;
  var collisionArea = this.getCollidingHeadArea();
  var collidedTiles = grid.collide(collisionArea);
  if(collidedTiles.length > 0) {
    if(debugMode) {
      this.markCollidedTiles(collidedTiles, collisionArea);
    }
    this.onRoofCollision(collidedTiles);
  }
}

Player.prototype.setWalkingDir = function() {
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

Player.prototype.getRightmostCollidedPoint = function(collidedTiles) {
  var biggestX = -Number.MAX_SAFE_INTEGER;
  var numCollidedTiles = collidedTiles.length
  for(var index = 0; index < numCollidedTiles; index++) {
    var tile = collidedTiles[index];
    if(tile.getMiddlePoint().x < this.getMiddlePoint().x) { //Only care if tile is to the left of player
      var x = tile.pos.x + tile.width;
      if(x > biggestX) {
        biggestX = x;
      }
    }
  }
  return biggestX;
}

Player.prototype.getLeftmostCollidedPoint = function(collidedTiles) {
  var smallestX = Number.MAX_SAFE_INTEGER;
  var numCollidedTiles = collidedTiles.length
  for(var index = 0; index < numCollidedTiles; index++) {
    var tile = collidedTiles[index];
    if(tile.getMiddlePoint().x > this.getMiddlePoint().x) { //Only care if tile is to the right of player
      if(tile.pos.x < smallestX) {
        smallestX = tile.pos.x;
      }
    }
  }
  return smallestX;
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
  } else {
    var img = imageLoader.getImage("player");
    if(this.isJumping()) {
      img = imageLoader.getImage("player_jump");
    }
    canvas.context.drawImage(img, this.pos.x, this.pos.y, img.width, img.height);
  }
}

module.exports = Player;