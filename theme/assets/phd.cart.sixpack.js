var ProductItem = require('./phd.cart.sixpack.item.js');
var ProductHolder = require('./phd.cart.sixpack.holder.js');

var SixPackBuilder = function (standard_cart) {
  this.standard_cart = standard_cart;
  this.holding_ele_selector = '[data-phd-six-pack="holding"]';
  this.item_ele_selector = '[data-phd-six-pack="item"]';
  
  this._init_holder();
  this._init_items();
};

SixPackBuilder.prototype._init_holder = function () {
  var _this = this;
  var $holding_element = $(this.holding_ele_selector);
  this.product_holder = new ProductHolder($holding_element);
  
  this.product_holder.on('AddToCart', function (products) {
    _this.standard_cart.add_products(products);
  });
};

SixPackBuilder.prototype._init_items = function () {
  var _this = this;
  var $item_elements = $(this.item_ele_selector);
  $item_elements.each(function (i, item_ele) {
    var $item = $(item_ele);
    var item = new ProductItem($item, i);
    
    item.on('AddToHolding', function (product) {
      var product_count = _this.product_holder.add_to_holding(product);
      item.holding_count = product_count;
      
      console.log(_this.product_holder.items);
    });
    
    item.on('RemoveFromHolding', function (product_id) {
      var product_count = _this.product_holder.remove_from_holding(product_id);
      item.holding_count = (product_count > 0) ? product_count : '';
      
      console.log(_this.product_holder.items);
    });
    
    item.on('UpdateHolding', function (product, qty) {
      var product_count = _this.product_holder.update_item_in_holding(product, qty);
      item.holding_count = (product_count > 0) ? product_count : '';
      
      console.log(_this.product_holder.items);
    });
  });
};

module.exports = SixPackBuilder;