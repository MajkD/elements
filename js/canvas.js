Canvas = function() {
  var context = undefined;
  // var contain..
}

Canvas.prototype.getContext = function() {
  return context;
}

// Canvas.prototype.getHeight = function() {
//   return context;
// }

Canvas.prototype.init = function() {
  myCanvasContainer = document.createElement('div');
  document.body.appendChild(myCanvasContainer);
  myCanvasContainer.style.position = "absolute";
  myCanvasContainer.style.left = "0px";
  myCanvasContainer.style.top = "0px";
  myCanvasContainer.style.width = "100%";
  myCanvasContainer.style.height = "100%";
  myCanvasContainer.style.zIndex = "1000";

  myCanvas = document.createElement('canvas');
  myCanvas.style.width = myCanvasContainer.scrollWidth + "px";
  myCanvas.style.height = myCanvasContainer.scrollHeight + "px";
  myCanvas.width = myCanvasContainer.scrollWidth;
  myCanvas.height = myCanvasContainer.scrollHeight;
  myCanvas.style.overflow = "visible";
  myCanvas.style.position = "absolute";
  myCanvas.style.backgroundColor = "#171717";
  // myCanvas.style.backgroundColor = "gray";
  myCanvasContainer.appendChild(myCanvas);

  context = myCanvas.getContext('2d');
}

module.exports = Canvas;