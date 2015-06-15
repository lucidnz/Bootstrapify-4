require('./_polyfills.js').objectKeys();
var CartItem = require('./phd.cart.standard_display_item.js');

var StandardCartDisplayItems = function (items_wrapper_selector, item_selector, item_template) {
  this.items = {};
  this.item_selector = item_selector;
  this.items_wrapper_selector = items_wrapper_selector;
  this.$items = $(item_selector);
  this.$items_wrapper = $(items_wrapper_selector);
  this.$item_template = $(item_template);
  // remove data parts from selector string so we can access with .data() & .attr()
  this.item_id_data_attr = item_selector.replace(/\[|\]/g, '');
  this.item_id_data = this.item_id_data_attr.replace('data-', '');
  
  this._collect_items_from_dom();
};

StandardCartDisplayItems.prototype.update_cart_item = function (item) {
  if (this.has_item(item.id)) {
    this.items[item.id].update(item);
  } else {
    this._build_new_item(item);
  }
};

StandardCartDisplayItems.prototype.has_item = function (item_id) {
  var has_item = false;
  for (var i in this.items) {
    if (i === item_id.toString()) {
      has_item = true;
      break;
    }
  }
  return has_item;
};

StandardCartDisplayItems.prototype.count = function () {
  return Object.keys(this.items).length;
};

StandardCartDisplayItems.prototype.clear_items = function () {
  this.items = {};
  this.$items_wrapper.html('');
};

// Private

StandardCartDisplayItems.prototype._add_new_item = function (item_id) {
  this.items[item_id] = new CartItem(this.items_wrapper_selector, this.item_selector, item_id);
};

StandardCartDisplayItems.prototype._collect_items_from_dom = function () {
  var _this = this;
  this.$items.each(function (i, item) {
    var $item = $(item);
    var item_id = $item.data(_this.item_id_data);
    if (!_this.has_item(item_id)) {
      _this._add_new_item(item_id);
    }
  });
};

StandardCartDisplayItems.prototype._build_new_item = function (item) {
  var $item_markup = $(this.$item_template.html());
  $item_markup.data(this.item_id_data, item.id).attr(this.item_id_data_attr, item.id);
  this.$items_wrapper.append($item_markup);
  
  this._add_new_item(item.id);
  this.items[item.id].update(item);
};

module.exports = StandardCartDisplayItems;