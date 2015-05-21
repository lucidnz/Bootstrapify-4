var SixPackHolderItemsDisplay = function ($ele, limit_multiple, items) {
  this.$ele = $ele;
  this.items = items;
  this.limit_multiple = limit_multiple;
  
  this._add_event_listeners();
  this._build_empty_display_items();
};

SixPackHolderItemsDisplay.prototype.update = function () {
  this._redraw_display_items();
  this._update_display_items();
};

// Private

SixPackHolderItemsDisplay.prototype._add_event_listeners = function () {
  var _this = this;
  _this.items.on('ItemsUpdated', function () {
    _this.update();
  });
};

SixPackHolderItemsDisplay.prototype._redraw_display_items = function () {
  this.$ele.html('');
  var items_count = this.items.total_count();
  var limit = Math.floor(items_count / this.limit_multiple) + 1;
  for (var j = 0; j < limit; j++) {
    this._build_empty_display_items();
  }
};

SixPackHolderItemsDisplay.prototype._build_empty_display_items = function () {
  for (var i = 0; i < this.limit_multiple; i++) {
    this.$ele.append(this._empty_display_item_markup());
  }
};

SixPackHolderItemsDisplay.prototype._empty_display_item_markup = function () {
  return '<div class="holding-item holding-item-disabled"><span class="text-muted">item</span></div>';
};

SixPackHolderItemsDisplay.prototype._update_display_items = function () {
  var items_count = this.items.total_count();
  for (var i = 0; i < items_count; i++) {
    var item = this.items.product_by_index(i);
    this.$ele.find('.holding-item').eq(i).removeClass('holding-item-disabled').html(item.title);
  }
};

module.exports = SixPackHolderItemsDisplay;