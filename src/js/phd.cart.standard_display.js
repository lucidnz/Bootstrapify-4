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

StandardCartDisplay.prototype.update_cart_items = function (cart_items) {
  // pretty brutal but we wipe the cart items before we redraw them with the updated content
  this.clear();

  // add cart items
  if (cart_items.length === undefined) {
    this._add_cart_items_as_object(cart_items);
  } else {
    this._add_cart_items_as_array(cart_items);
  }
  
  // anything post that we need to do
  this.post_update();
};

StandardCartDisplay.prototype.update_cart_item = function (item) {
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

StandardCartDisplay.prototype.post_update = function () {
  // update the empty display message states
  this._update_cart_empty_state();
};

// Private

StandardCartDisplay.prototype._add_cart_items_as_object = function (cart_items) {
  // if cart_items is an object then create an array from it and hand it off the the array method to sort and add
  var items = [];
  for (var key in cart_items) {
    if (cart_items.hasOwnProperty(key)) {
      var item = cart_items[key];
      items.push(item);
    }
  }
  this._add_cart_items_as_array(items);
};

StandardCartDisplay.prototype._add_cart_items_as_array = function (cart_items) {
  // sort items by title
  cart_items.sort(function (a, b) {
    if (a.title > b.title) return 1;
    if (a.title < b.title) return -1;
    return 0;
  });
  
  // add new items
  for (var i = 0; i < cart_items.length; i++) {
    var item = cart_items[i];
    this.update_cart_item(item);
  }
};

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