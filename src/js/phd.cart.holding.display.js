/*jshint multistr: true */

var PhdCartHoldingDisplay = function ($ele) {
  this.$ele = $ele;
  this.$items_wrapper = this.$ele.find('[data-phd-holding-items]');
  this.submit_to_cart_button = this.$ele.find('[type="submit"]');
  
  this._build_properties();
  this._build_empty_display_items();
};

PhdCartHoldingDisplay.prototype.add_item = function (items, is_submitable) {
  
  // redraw
  this.$items_wrapper.html('');
  var limit = Math.floor(items.length / this.limit_multiple) + 1;
  for (var j = 0; j < limit; j++) {
    this._build_empty_display_items(limit);
  }
  
  // update item
  var item_ids = [];
  for (var i = 0; i < items.length; i++) {
    var item_id = items[i].id;
    var item_title = items[i].title;
    this.$items_wrapper.find('.holding-item').eq(i).removeClass('holding-item-disabled').html(item_title);
    
    item_ids.push(item_id);
  }
  
  // add item ids to submit button for adding to cart
  this.submit_to_cart_button.data('phd-variant-id', item_ids).attr('data-phd-variant-id', item_ids);
  
  // toggle submit
  if (is_submitable) {
    this.submit_to_cart_button.prop('disabled', false);
  } else {
    this.submit_to_cart_button.prop('disabled', true);
  }
  
};

PhdCartHoldingDisplay.prototype._build_properties = function () {
  Object.defineProperty(this, 'limit_multiple', {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.$ele.data('phd-holding-limit-multiple');
    },
    set: function (new_value) {
      if (this.$ele.data('phd-holding-limit-multiple') !== new_value) {
        this.$ele.data('phd-holding-limit-multiple', new_value).attr('data-phd-holding-limit-multiple', new_value);
      }
    }
  });
};

PhdCartHoldingDisplay.prototype._build_empty_display_items = function () {
  for (var i = 0; i < this.limit_multiple; i++) {
    this.$items_wrapper.append(this._empty_display_item_markup());
  }
};

PhdCartHoldingDisplay.prototype._empty_display_item_markup = function () {
  return '<div class="holding-item holding-item-disabled"><span class="text-muted">item</span></div>';
};

module.exports = PhdCartHoldingDisplay;