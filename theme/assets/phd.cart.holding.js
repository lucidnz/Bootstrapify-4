var HoldingDisplay = require('./phd.cart.holding.display.js');

var PhdCartHolding = function () {
  var display_element_selector = '[data-phd-holding]';
  var $display_element = $(display_element_selector);
  
  if ($display_element.length > 0) {
    this.display = new HoldingDisplay($display_element);
    this.limit_multiple = this.display.limit_multiple || 6;
    this.items = [];
    this.items_are_addable = false;
  } else {
    return false;
  }
};

PhdCartHolding.prototype.add_product = function (product_id) {
  this.items.push(product_id);
  this._update_addable();
  this.display.add_item(this.items, this.items_are_addable);
};

PhdCartHolding.prototype._update_addable = function () {
  if (this._is_addable()) {
    this.items_are_addable = true;
  } else {
    this.items_are_addable = false;
  }
};

PhdCartHolding.prototype._is_addable = function () {
  var items_mod = this.items.length % this.limit_multiple;
  return this.items.length > 0 && items_mod === 0;
};

module.exports = PhdCartHolding;