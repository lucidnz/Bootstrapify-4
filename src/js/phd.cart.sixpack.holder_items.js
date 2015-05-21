var Eventer = require('./_eventer.js');

var SixPackHolderItems = function (limit_multiple) {
  new Eventer(this);
  
  this.products = [];
  this.products_are_addable = false;
  this.limit_multiple = limit_multiple;
};

SixPackHolderItems.prototype.add_item = function (product) {
  this.products.push(product);
  this._update_is_addable_and_trigger('ItemAdded');
};

SixPackHolderItems.prototype.remove_item = function (product_id) {
  for (var i = this.total_count() - 1; i > -1; i--) { // loop backwards to remove the last added item
    var removed = this._remove_product_from_stack(product_id, i);
    if (removed) {
      break;
    }
  }
  this._update_is_addable_and_trigger('ItemRemoved');
};

SixPackHolderItems.prototype.update_item = function (product, qty) {
  
  console.log('update_item', qty);
  
  // remove all items for a clean slate
  for (var i = 0; i < this.products.length; i++) {
    this._remove_product_from_stack(product.id, i);
  }
  // re add the products if we have them
  if (qty > 0) {
    for (var j = 0; j < qty; j++) {
      this.products.push(product);
    }
  }
  this._update_is_addable_and_trigger('ItemUpdated');
};

SixPackHolderItems.prototype.item_count = function (product_id) {
  var count = 0;
  for (var i = 0; i < this.products.length; i++) {
    if (this.products[i].id === product_id) {
      count++;
    }
  }
  return count;
};

SixPackHolderItems.prototype.total_count = function () {
  return this.products.length;
};

SixPackHolderItems.prototype.product_by_index = function (index) {
  return this.products[index];
};

// Private

SixPackHolderItems.prototype._remove_product_from_stack = function (product_id, i) {
  var removed = [];
  if (this.products[i].id === product_id) {
    removed = this.products.splice(i, 1);
  }
  return removed.length > 0;
};

SixPackHolderItems.prototype._update_is_addable_and_trigger = function (custom_event) {
  this.products_are_addable = this._is_addable();
  this.trigger(custom_event);
  this.trigger('ItemsUpdated');
};

SixPackHolderItems.prototype._is_addable = function () {
  var total_count = this.total_count();
  var products_mod = total_count % this.limit_multiple;
  return total_count > 0 && products_mod === 0;
};

module.exports = SixPackHolderItems;