var SixPackHolderItemsDisplay = function ($ele, limit_multiple, items) {
  this.$ele = $ele;
  this.items = items;
  this.limit_multiple = limit_multiple;
  this.tooltip_selector = '[data-toggle="tooltip"]';
  
  this.default_color = '#E0F0D9';
  
  this._add_event_listeners();
  this._build_empty_display_items();
  this._add_tooltips();
};

SixPackHolderItemsDisplay.prototype.update = function () {
  this._redraw_display_items();
  this._update_display_items();
  this._add_tooltips();
};

// Private

SixPackHolderItemsDisplay.prototype._add_event_listeners = function () {
  var _this = this;
  _this.items.on('ItemsUpdated', function () {
    _this.update();
  });
};

SixPackHolderItemsDisplay.prototype._redraw_display_items = function () {
  this._remove_tooltips();
  this.$ele.html('');
  var items_count = this.items.total_count();
  var limit = Math.floor(items_count / this.limit_multiple) + 1;
  for (var j = 0; j < limit; j++) {
    if (j > 0) {
      this.$ele.append(this._display_item_spacer_markup());
    }
    this._build_empty_display_items();
  }
};

SixPackHolderItemsDisplay.prototype._build_empty_display_items = function () {
  for (var i = 0; i < this.limit_multiple; i++) {
    this.$ele.append(this._empty_display_item_markup());
  }
};

SixPackHolderItemsDisplay.prototype._empty_display_item_markup = function () {
  return '<div class="holding-item holding-item-disabled" data-toggle="tooltip" data-placement="bottom" title="Empty item slot"></div>';
};

SixPackHolderItemsDisplay.prototype._display_item_spacer_markup = function () {
  return '<div class="holding-item-spacer"></div>';
};

SixPackHolderItemsDisplay.prototype._update_display_items = function () {
  var items_count = this.items.total_count();
  for (var i = 0; i < items_count; i++) {
    var item = this.items.product_by_index(i);
    
    var item_color = item.color || this.default_color;
    if (item_color.indexOf('#') === -1) {
      item_color = '#'+item_color;
    }

    this.$ele.find('.holding-item').eq(i)
    .removeClass('holding-item-disabled')
    .attr('title', item.title)
    .css('background-color', item_color);
  }
};

SixPackHolderItemsDisplay.prototype._add_tooltips = function () {
  $(this.tooltip_selector).tooltip();
};

SixPackHolderItemsDisplay.prototype._remove_tooltips = function () {
  $(this.tooltip_selector).tooltip('destroy');
};

module.exports = SixPackHolderItemsDisplay;