Utils = function () {
}

Utils.prototype.clamp = function(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

Utils.prototype.renderFilledSquare = function(pointA, pointB, color) {
  var width = pointB.x - pointA.x;
  var height = pointB.y - pointA.y;
  canvas.context.beginPath();
  canvas.context.fillStyle = color;
  canvas.context.fillRect(pointA.x, pointA.y, width, height);
  canvas.context.stroke();
}

Utils.prototype.renderSquare = function(pointA, pointB, color) {
  var width = pointB.x - pointA.x;
  var height = pointB.y - pointA.y;
  canvas.context.beginPath();
  canvas.context.lineWidth = "2";
  canvas.context.strokeStyle = color;
  canvas.context.rect(pointA.x, pointA.y, width, height);
  canvas.context.stroke();
}

module.exports = Utils;