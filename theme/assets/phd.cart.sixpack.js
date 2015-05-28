var ProductItem = require('./phd.cart.sixpack.item.js');
var ProductHolder = require('./phd.cart.sixpack.holder.js');

var SixPackBuilder = function (cart) {
  this.cart = cart;
  this.holding_ele_selector = '[data-phd-six-pack="holding"]';
  this.item_ele_selector = '[data-phd-six-pack="item"]';
  this.items = {};
  
  this._init_holder();
  this._init_items();
};

SixPackBuilder.prototype._init_holder = function () {
  var _this = this;
  var $holding_element = $(this.holding_ele_selector);
  _this.product_holder = new ProductHolder($holding_element);
  _this.product_holder.on('AddToCart', function (products) {
//     _this.cart.
  });
  
  // update an item if it was removed from inside the holder
  _this.product_holder.on('RemoveItem', function (product_id, product_count) {
    _this.items[product_id].holding_count = product_count;
  });
};

SixPackBuilder.prototype._init_items = function () {
  var _this = this;
  var $item_elements = $(this.item_ele_selector);
  $item_elements.each(function (i, item_ele) {
    var $item = $(item_ele);
    var item = new ProductItem($item, i);
    
    // store items by variant id for easy access later
    _this.items[item.variant_id] = item;
    
    item.on('AddToHolding', function (product) {
      var product_count = _this.product_holder.add_to_holding(product);
      item.holding_count = product_count;
    });
    
    item.on('RemoveFromHolding', function (product_id) {
      var product_count = _this.product_holder.remove_from_holding(product_id);
      item.holding_count = (product_count > 0) ? product_count : '';
    });
    
    item.on('UpdateHolding', function (product, qty) {
      var product_count = _this.product_holder.update_item_in_holding(product, qty);
      item.holding_count = (product_count > 0) ? product_count : '';
    });
  });
};

module.exports = SixPackBuilder;