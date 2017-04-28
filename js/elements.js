log = undefined;
Elements = function(logger) {
  log = logger;
}

Elements.prototype.init = function() {
  log("Elements is alive!");
}

Elements.prototype.update = function(delta) {
  log("elements update");
}

module.exports = Elements;