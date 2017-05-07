Canvas = function() {
  this.context = undefined;
  this.canvas = undefined;
  this.canvasContainer = undefined;
}

Canvas.prototype.getContext = function() {
  this.context;
}

Canvas.prototype.init = function() {
  this.canvasContainer = document.createElement('div');
  document.body.appendChild(this.canvasContainer);
  this.canvasContainer.style.position = "absolute";
  this.canvasContainer.style.left = "0px";
  this.canvasContainer.style.top = "0px";
  this.canvasContainer.style.width = "100%";
  this.canvasContainer.style.height = "100%";
  this.canvasContainer.style.zIndex = "1000";

  this.canvas = document.createElement('canvas');
  this.canvas.style.width = this.canvasContainer.scrollWidth + "px";
  this.canvas.style.height = this.canvasContainer.scrollHeight + "px";
  this.canvas.width = this.canvasContainer.scrollWidth;
  this.canvas.height = this.canvasContainer.scrollHeight;
  this.canvas.style.overflow = "visible";
  this.canvas.style.position = "absolute";
  this.canvas.style.backgroundColor = "#171717";
  this.canvasContainer.appendChild(this.canvas);

  this.context = this.canvas.getContext('2d');
}

Canvas.prototype.clear = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); 
}

module.exports = Canvas;