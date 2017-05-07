ImageLoader = function() {
}

ImageLoader.prototype.loadImages = function(onImagesLoaded) {
  this.imagesLoadedCallback = onImagesLoaded;
  this.myTileImage = new Image(32, 32);
  this.myTileImage.onload = this.imageLoaded.bind(this);
  this.myTileImage.onerror = this.imageError.bind(this);
  this.myTileImage.src = "././images/tile.png";
}

ImageLoader.prototype.imageError = function(error) {
  log(error);
}

ImageLoader.prototype.imageLoaded = function() {
  this.imagesLoadedCallback();
}

ImageLoader.prototype.getTileImage = function() {
  return this.myTileImage;
}

module.exports = ImageLoader;