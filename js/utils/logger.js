Logger = function () {
  this.xPos = 50;
  this.yPos = 680;
  this.message = "";
  this.font = "15px Arial";
  this.fillStyle = "white";
};

Logger.prototype.logToScreen = function (message) {
  this.message = message;
}

Logger.prototype.render = function () {
  canvas.context.font = this.font;
  canvas.context.fillStyle = this.fillStyle;
  canvas.context.fillText(this.message, this.xPos, this.yPos);
}