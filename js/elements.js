require('./world.js')
require('./player/player.js')
require('./camera.js')

log = undefined;
Elements = function(logger) {
  log = logger;
}

Elements.prototype.init = function(onElementsInitialized) {
  this.camera = new Camera();
  this.onElementsInitialized = onElementsInitialized;
  this.world = new World();
  if(isEditor) {
    this.onElementsInitialized();
  } else {
    var _this = this;
    var fileReader = require('jsonfile')
    fileReader.readFile(data_path + "game.json", function(err, gameData) {
      if (err) throw err;
      _this.gameDataLoaded(gameData);
    });
  }
}

Elements.prototype.gameDataLoaded = function(gameData) {
  if(!isEditor) {
    var path = data_path + gameData.worldData;
    this.world.loadLevel(path, this.worldDataLoaded.bind(this));
  }
}

Elements.prototype.worldDataLoaded = function() {
  if(!isEditor) {
    var _this = this;
    var fileReader = require('jsonfile')
    fileReader.readFile(data_path + "player/player.json", function(err, playerData) {
      if (err) throw err;
      _this.playerDataLoaded(playerData);
    });
  }
}

Elements.prototype.playerDataLoaded = function(playerData) {
  this.player = new Player(playerData);
  this.world.initPlayer(this.player);
  this.camera.init(this.player);
  this.onElementsInitialized();
}

Elements.prototype.update = function(delta) {
  this.world.update(delta, this.player);
  if(isEditor) return;
  this.camera.update(this.player, this.world);
  this.player.update(delta, this.world.grid);
}

Elements.prototype.render = function() {
  this.world.render(this.camera);
  if(isEditor) return;
  this.player.render(this.camera);

  // For debug purposes
  // this.camera.renderDebug();
}

Elements.prototype.mouseClicked = function() {
  if(isEditor) {
    this.world.mouseClicked({x: event.clientX, y: event.clientY})
  }
}

Elements.prototype.keyDown = function(keyCode) {
  if(isEditor) return;
  if(debugCamera) {
    if(keyCode == 87) this.camera.onKeyPressed('w');
    if(keyCode == 83) this.camera.onKeyPressed('s');
    if(keyCode == 65) this.camera.onKeyPressed('a');
    if(keyCode == 68) this.camera.onKeyPressed('d');
    if(keyCode == 81) this.camera.onKeyPressed('q');
    if(keyCode == 69) this.camera.onKeyPressed('e');
  }

  if(keyCode == 37) this.player.onLeftDown();
  if(keyCode == 39) this.player.onRightDown();
  if(keyCode == 32) this.player.onSpacePressed();
}

Elements.prototype.keyUp = function(keyCode) {
  if(isEditor) {
    if(keyCode == 83) {
      this.world.saveMap();
    }
    if(keyCode == 76) {
      this.world.loadMap();
    }
  } else {
    if(keyCode == 37) {
      this.player.onLeftUp();
    }
    if(keyCode == 39) {
      this.player.onRightUp();
    }
  }
}

module.exports = Elements;