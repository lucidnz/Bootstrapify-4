var Eventer = require('./_eventer.js');
var ItemsTotal = require('./phd.cart.sixpack.holder_total.js');
var ItemsHolder = require('./phd.cart.sixpack.holder_items.js');
var ItemsDisplay = require('./phd.cart.sixpack.holder_display.js');
var ItemSubmitter = require('./phd.cart.sixpack.holder_submitter.js');

// TODO: submitter class

var SixPackHolder = function ($ele) {
  this.$ele = $ele;
  new Eventer(this);
  
  var limit_multiple = this.$ele.data('phd-holding-limit-multiple') || 6;
  var subscription_id = this.$ele.data('phd-subscription-id');
  var shipping_interval_frequency = this.$ele.data('phd-shipping-interval-frequency');
  var shipping_interval_unit_type = this.$ele.data('phd-shipping-interval-unit-type');
  
  var display_element = this.$ele.find('[data-phd-holding-items]');
  var submitter_element = this.$ele.find('form');
  
  this.items = new ItemsHolder(limit_multiple, subscription_id, shipping_interval_frequency, shipping_interval_unit_type);
  this.total_display = new ItemsTotal(this.items);
  this.items_display = new ItemsDisplay(display_element, limit_multiple, this.items);
  this.submitter = new ItemSubmitter(submitter_element, this.items);
  
  this._add_event_listeners();
};

SixPackHolder.prototype.add_to_holding = function (product) {
  this.items.add_item(product);
  return this.items.item_count(product.id);
};

SixPackHolder.prototype.remove_from_holding = function (product_id) {
  this.items.remove_item(product_id);
  return this.items.item_count(product_id);
};

SixPackHolder.prototype.update_item_in_holding = function (product, qty) {
  this.items.update_item(product, qty);
  return this.items.item_count(product.id);
};

// Private

SixPackHolder.prototype._add_event_listeners = function () {
  var _this = this;
  
  // remove an item from holding, but from inside its display
  _this.items_display.on('RemoveDisplayItem', function (product_id) {
    _this.items.remove_item(product_id);
    var args = [
      product_id,
      this.items.item_count(product_id)
    ];
    _this.trigger('RemoveItem', args);
  });
};

module.exports = SixPackHolder;