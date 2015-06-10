var CartJS = require('shopify-cartjs');
var DataModel = require('./_data_model.js');

var StandardCartDisplay = function () {
  this._render_cart();
  this._add_event_listenters();
};

// Private

StandardCartDisplay.prototype._render_cart = function () {
};

StandardCartDisplay.prototype._add_event_listenters = function () {
};

module.exports = StandardCartDisplay;