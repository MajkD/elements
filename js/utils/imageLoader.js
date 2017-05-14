ImageLoader = function() {
  this.images = [ 
  {
    "name": "tile",
    "dim": { "width": 32, "height": 32 }
  },
  {
    "name": "tile_mark_1",
    "dim": { "width": 32, "height": 32 }
  },
  {
    "name": "tile_mark_2",
    "dim": { "width": 32, "height": 32 }
  },
  {
    "name": "tile_mark_3",
    "dim": { "width": 32, "height": 32 }
  },
  {
    "name": "tile_mark_4",
    "dim": { "width": 32, "height": 32 }
  },
  {
    "name": "player",
    "dim": { "width": 64, "height": 96 }
  },
  {
    "name": "player_jump",
    "dim": { "width": 64, "height": 96 }
  }
  ];
  this.imagesLoading = 0;
  this.loadedImages = {};
}

ImageLoader.prototype.loadImages = function(onImagesLoaded) {
  this.imagesLoadedCallback = onImagesLoaded;
  var numImages = this.images.length;
  for(var index = 0; index < numImages; index++) {
    this.imagesLoading++;
    var img = this.images[index];
    this.loadedImages[img.name] = new Image(img.dim.width, img.dim.height);
    this.loadedImages[img.name].onload = this.imageLoaded.bind(this);
    this.loadedImages[img.name].onerror = this.imageError.bind(this);
    this.loadedImages[img.name].src = "././images/" + img.name + ".png";
  }
}

ImageLoader.prototype.imageError = function(error) {
  log(error);
}

ImageLoader.prototype.imageLoaded = function() {
  this.imagesLoading--;
  if(this.imagesLoading <= 0) {
    this.imagesLoadedCallback();  
  }
}

ImageLoader.prototype.getImage = function(name) {
  return this.loadedImages[name];
}

module.exports = ImageLoader;