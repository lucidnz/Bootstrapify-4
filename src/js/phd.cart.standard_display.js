var DataModel = require('./_data_model.js');
var CartItems = require('./phd.cart.standard_display_items.js');

var StandardCartDisplay = function () {
  
  // will need on of these for sub and one-off groups each?
  
  var items_wrapper_selector = '[data-phd-side-cart-items]';
  var item_selector = '[data-phd-side-cart-item]';
  var item_template = '#phd-side-cart-item';
  this.items = new CartItems(items_wrapper_selector, item_selector, item_template);
};

StandardCartDisplay.prototype.update_cart_item = function (item) {
  this.items.update_cart_item(item);
};

module.exports = StandardCartDisplay;