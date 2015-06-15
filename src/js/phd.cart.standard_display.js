var DataModel = require('./_data_model.js');
var CartItems = require('./phd.cart.standard_display_items.js');

var StandardCartDisplay = function () {
  this.$details = $('.side-cart-details');
  this.$empty_message = $('.side-cart-empty');
  this.section_empty_message_selector = '.side-cart-section-empty';
  
  var item_template = '.phd-side-cart-item-template';
  var item_selector = '[data-phd-side-cart-item]';
  var subscription_items_wrapper_selector = '[data-phd-side-cart-items-subscription]';
  var one_off_items_wrapper_selector = '[data-phd-side-cart-items-one-off]';
  
  this.subscription_items = new CartItems(subscription_items_wrapper_selector, item_selector, item_template);
  this.one_off_items = new CartItems(one_off_items_wrapper_selector, item_selector, item_template);
  
  this.item_groups = [
    this.subscription_items,
    this.one_off_items
  ];
};

StandardCartDisplay.prototype.update = function (cart) {
  // pretty brutal but we wipe the cart items before we redraw them with the updated content
  this.clear();

  // add the updated content
  for (var i = 0; i < cart.items.length; i++) {
    var item = cart.items[i];
    this.update_cart_item(item);
  }
  
  // update the empty display message states
  this._update_cart_empty_state();
};

StandardCartDisplay.prototype.update_cart_item = function (item) {
  
  console.log('update_cart_item', item);
  
  
  if (item.properties.subscription_id !== undefined) {
    this.subscription_items.update_cart_item(item);
  } else {
    this.one_off_items.update_cart_item(item);
  }
};

StandardCartDisplay.prototype.clear = function () {
  this._each(function (i, item_group) {
    item_group.clear_items();
  });
};

// Private

StandardCartDisplay.prototype._update_cart_empty_state = function () {
  var total_items = 0;
  
  // hide/show the sections empty message
  this._each(function (i, item_group) {
    var item_group_count = item_group.count();
    if (item_group_count > 0) {
      item_group.$items_wrapper.next(this.section_empty_message_selector).hide();
      total_items += item_group_count;
    } else {
      item_group.$items_wrapper.next(this.section_empty_message_selector).show();
    }
  });
  
  // hide/show global sections empty message
  if (total_items > 0) {
    this.$empty_message.hide();
    this.$details.show();
  } else {
    this.$empty_message.show();
    this.$details.hide();
  }
};

StandardCartDisplay.prototype._each = function (callback) {
  for (var i = 0; i < this.item_groups.length; i++) {
    var item_group = this.item_groups[i];
    callback(i, item_group);
  }
};

module.exports = StandardCartDisplay;