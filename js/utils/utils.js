Utils = function () {
}

Utils.prototype.rectangleOverlap = function(rect1, rect2) {
  return Math.max(rect1.p1.x, rect2.p1.x) < Math.min(rect1.p2.x, rect2.p2.x) &&
         Math.max(rect1.p1.y, rect2.p1.y) < Math.min(rect1.p2.y, rect2.p2.y);
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

Utils.prototype.updateWindowTitle = function(newTitle) {
  var title = document.getElementById('title');
  var titleText = "Elements v." + elements_version;
  if(isEditor) {
   titleText += " (editor)"
  }
  title.text = titleText + newTitle;
}

Utils.prototype.getClass = function(obj) {
  if (typeof obj === "undefined")
    return "undefined";
  if (obj === null)
    return "null";
  return Object.prototype.toString.call(obj)
    .match(/^\[object\s(.*)\]$/)[1];
}

module.exports = Utils;