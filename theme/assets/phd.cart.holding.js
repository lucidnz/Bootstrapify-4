var PhdCartHolding = function () {
  this.limit_multiple = 6;
  this.items = [];
  this.items_are_addable = false;
};

PhdCartHolding.prototype.add_product = function (product_id) {
  this.items.push(product_id);
  this._update_addable();
  
  console.log('last added:', product_id);
  if (this.items_are_addable) console.log('Items are addable'); 
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
  return this.items.length > 0 && items_mod === 0
};

module.exports = PhdCartHolding;