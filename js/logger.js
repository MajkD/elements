Logger = function () {
  this.myXPos = 50;
  this.myYPos = 50;
  this.myMessage = "";
  this.myFont = "30px Arial";
  this.myFillStyle = "white";
};

Logger.prototype.clearLog = function() {
  this.myMessage = "";
}

Logger.prototype.logToScreen = function (message) {
  this.myMessage = message;
}

Logger.prototype.draw = function (canvas) {
  canvas.getContext().font = this.myFont;
  canvas.getContext().fillStyle = this.myFillStyle;
  canvas.getContext().fillText(this.myMessage, this.myXPos, this.myYPos);
}