var Eventer = require('./_eventer.js');

var SixPackHolderItems = function (id, limit_multiple, subscription_id, shipping_interval_frequency, shipping_interval_unit_type) {
  new Eventer(this);
  
  this.id = id;
  this.products = [];
  this.products_are_addable = false;
  this.limit_multiple = limit_multiple;
  this.subscription_id = subscription_id;
  this.shipping_interval_frequency = shipping_interval_frequency;
  this.shipping_interval_unit_type = shipping_interval_unit_type;
};

SixPackHolderItems.prototype.add_item = function (product) {
  this.products.push(product);
  this._update_is_addable_and_trigger('ItemAdded', [product.id, 'added']);
};

SixPackHolderItems.prototype.remove_item = function (product_id) {
  var total_count = this.total_count();
  for (var i = total_count - 1; i > -1; i--) { // loop backwards to remove the last added item
    var removed = this._remove_product_from_stack(product_id, i);
    if (removed) {
      break;
    }
  }
  this._update_is_addable_and_trigger('ItemRemoved', [product_id, 'removed']);
};

SixPackHolderItems.prototype.update_item = function (product, qty) {
  var item_count = this.item_count(product.id);
  // remove all items for a clean slate
  var total_count = this.total_count();
  for (var i = total_count - 1; i > -1; i--) { // loop backwards to remove the last added item
    this._remove_product_from_stack(product.id, i);
  }
  // re add the products if we have them
  if (qty > 0) {
    for (var j = 0; j < qty; j++) {
      this.products.push(product);
    }
  }
  var action = (item_count > qty) ? 'removed' : 'added';
  this._update_is_addable_and_trigger('ItemUpdated', [product.id, action]);
};

SixPackHolderItems.prototype.clear = function () {
  // clear the entire lot
  var products = this.all_products_by_id();
  for (var key in products) {
    if (products.hasOwnProperty(key)) {
      var product = products[key];
      this.update_item(product, 0);
    }
  }
  this.trigger('ItemsCleared');
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

SixPackHolderItems.prototype.total_price = function () {
  var total_price = 0;
  for (var i = 0; i < this.products.length; i++) {
    var product = this.products[i];
    total_price += product.price;
  }
  return Shopify.formatMoney(total_price, Bsify.money_formats.moneyFormat);
};

SixPackHolderItems.prototype.product_by_index = function (index) {
  return this.products[index];
};

SixPackHolderItems.prototype.all_products_by_id = function (include_subscription_details) {
  var products = {};
  for (var i = 0; i < this.products.length; i++) {
    var product = this.products[i];
    if (products[product.id]) {
      products[product.id].qty++;
    } else {
      products[product.id] = {
        id: product.id,
        title: product.title,
        qty: 1,
        properties: {
          added_by: this.id
        }
      };
      if (include_subscription_details) {
        products[product.id].properties.shipping_interval_frequency = this.shipping_interval_frequency;
        products[product.id].properties.shipping_interval_unit_type = this.shipping_interval_unit_type;
        products[product.id].properties.subscription_id = this.subscription_id;
      }
    }
  }
  return products;
};

// Private

SixPackHolderItems.prototype._remove_product_from_stack = function (product_id, i) {
  var removed = [];
  if (this.products[i].id === product_id) {
    removed = this.products.splice(i, 1);
  }
  return removed.length > 0;
};

SixPackHolderItems.prototype._update_is_addable_and_trigger = function (custom_event, custom_event_args) {
  this.products_are_addable = this._is_addable();
  this.trigger(custom_event, custom_event_args);
  this.trigger('ItemsUpdated', custom_event_args);
};

SixPackHolderItems.prototype._is_addable = function () {
  var total_count = this.total_count();
  var products_mod = total_count % this.limit_multiple;
  return total_count > 0 && products_mod === 0;
};

module.exports = SixPackHolderItems;