var SixPackHolderItems = function (limit_multiple) {
  this.items = {};
  this.items_are_addable = false;
  this.limit_multiple = limit_multiple;
  this.total_count = 0;
};

SixPackHolderItems.prototype.add_item = function (product) {
  if (this.items[product.id]) {
    this.items[product.id].qty += 1;
  } else {
    this.items[product.id] = product;
    this.items[product.id].qty = 1;
  }
  this._update_items_count();
};

SixPackHolderItems.prototype.remove_item = function (product_id) {
  if (this.items[product_id]) {
    this.items[product_id].qty -= 1;
    
    // remove item if it's qty is 0
    if (this.items[product_id].qty < 1) {
      delete this.items[product_id];
    }
  }
  this._update_items_count();
};

SixPackHolderItems.prototype.update_item = function (product, qty) {
  if (qty > 0) {
    if (!this.items[product.id]) {
      this.items[product.id] = product;
    }
    this.items[product.id].qty = qty;
  } else {
    if (this.items[product.id]) {
      delete this.items[product.id];
    }
  }
  this._update_items_count();
};

SixPackHolderItems.prototype.item_count = function (product_id) {
  return (this.items[product_id]) ? this.items[product_id].qty : 0;
};

// Private

SixPackHolderItems.prototype._update_items_count = function () {
  this.total_count = this._total_items_count();
  this.items_are_addable = this._are_items_addable();
};

SixPackHolderItems.prototype._total_items_count = function () {
  var count = 0;
  for (var key in this.items) {
    var item = this.items[key];
    count += item.qty;
  }
  return count;
};

SixPackHolderItems.prototype._are_items_addable = function () {
  var items_mod = this.total_count % this.limit_multiple;
  return this.total_count > 0 && items_mod === 0;
};

module.exports = SixPackHolderItems;