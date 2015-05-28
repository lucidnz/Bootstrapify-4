/*jshint multistr: true */

var Eventer = require('./_eventer.js');

var SixPackHolderItemsDisplay = function ($ele, limit_multiple, items) {
  this.$ele = $ele;
  this.items = items;
  this.limit_multiple = limit_multiple;
  this.tooltip_selector = '[data-toggle="tooltip"]';
  this.default_color = '#E0F0D9';
  
  new Eventer(this);
  
  this._add_event_listeners();
  this.reset();
};

SixPackHolderItemsDisplay.prototype.update = function (action) {
  this._clear_display_items();
  this._redraw_display_items();
  this._update_display_items();
  this._add_tooltips();
  if (action && action === 'added') {
    this._scroll_container();
  }
};

SixPackHolderItemsDisplay.prototype.reset = function () {
  this._clear_display_items();
  this._build_empty_display_items();
  this._add_tooltips();
};

// Private

SixPackHolderItemsDisplay.prototype._add_event_listeners = function () {
  var _this = this;
  _this.items.on('ItemsUpdated', function (product_id, action) {
    _this.update(action);
  });
  
  _this.$ele.on('click', '.holding-item', function (e) {
    e.preventDefault();
    _this._remove_item(e);
  });
};

SixPackHolderItemsDisplay.prototype._redraw_display_items = function () {
  var items_count = this.items.total_count();
  var limit = Math.floor(items_count / this.limit_multiple) + 1;
  for (var j = 0; j < limit; j++) {
    this._build_empty_display_items();
  }
};

SixPackHolderItemsDisplay.prototype._clear_display_items = function () {
  this._remove_tooltips();
  this.$ele.html('');
};

SixPackHolderItemsDisplay.prototype._build_empty_display_items = function () {
  var markup = '';
  for (var i = 0; i < this.limit_multiple; i++) {
    markup += this._empty_display_item_markup();
  }
  this.$ele.append('<div class="holding-item-group">'+markup+'</div>');
};

SixPackHolderItemsDisplay.prototype._empty_display_item_markup = function () {
  return '<a class="holding-item holding-item-disabled" data-toggle="tooltip" data-placement="right" data-phd-item-id title="Empty item slot">\
    <span class="fa fa-times-circle"></span>\
    <svg version="1.2" baseprofile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="0 0 150 400" xml:space="preserve"> <path d="M64.2,9.6c-4.7,0.3-9.3,0.6-13.9,1.9c-3.6,1.1-5.6,3.7-6,7c-0.9,7.5-1.8,15-1.3,22.5c0.2,2.2,1.7,4.1,1.7,6.5,c0,2.5,0.4,4.9,0.7,7.4c0.1,1.2-0.6,1.6-1.6,1.8c-1.3,0.3-2.4,0.9-2.8,2.4c-0.7,2.9-0.4,3.4,2.6,3.9c1.2,0.2,1.8,0.7,1.8,2,c-0.1,2.7,0,5.3,0,8c0,0.8-0.1,1.5-0.9,2c-8.4,3.8-18.1,15.8-18.1,15.8c-5.8,7.6-9.3,16.1-11.6,25.4c-1.1,4.4-1,8.7-1.1,13.1,l-0.2,211.4c-0.2,11.5-0.4,22.9,0.2,34.4c0.4,8,4.8,12.5,13.5,14.1c5.5,1,11,1.3,16.5,1.6c8.1,0.3,18.1,0.1,26.2,0.2h10.2,c8.1,0,18.1,0.2,26.2-0.2c5.5-0.2,11-0.5,16.5-1.6c8.7-1.6,13.1-6.1,13.5-14.1c0.6-11.5,0.3-22.9,0.2-34.4l-0.2-211.4,c0-4.4,0.1-8.7-1.1-13.1c-2.3-9.2-5.9-17.7-11.6-25.4c0,0-8-11.3-18.1-15.8c-0.8-0.5-0.9-1.2-0.9-2c0-2.7,0-5.3,0-8,c0-1.3,0.6-1.8,1.8-2c2.9-0.5,3.2-1,2.6-3.9c-0.4-1.5-1.5-2.1-2.8-2.4c-1-0.2-1.7-0.7-1.6-1.8c0.2-2.5,0.6-4.9,0.7-7.4,c0-2.3,1.6-4.2,1.7-6.5c0.5-7.6-0.3-15.1-1.3-22.5c-0.4-3.3-2.4-5.9-6-7c-4.6-1.3-9.2-1.6-13.9-1.9C75.3,8.5,64.2,9.6,64.2,9.6,c-4.7,0.3-9.3,0.6-13.9,1.9c-3.6,1.1-5.6,3.7-6,7c-0.9,7.5-1.8,15-1.3,22.5c0.2,2.2,1.7,4.1,1.7,6.5c0,2.5,0.4,4.9,0.7,7.4,c0.1,1.2-0.6,1.6-1.6,1.8c-1.3,0.3-2.4,0.9-2.8,2.4c-0.7,2.9-0.4,3.4,2.6,3.9c1.2,0.2,1.8,0.7,1.8,2c-0.1,2.7,0,5.3,0,8,c0,0.8-0.1,1.5-0.9,2"></path> </svg>\
  </a>';
};

SixPackHolderItemsDisplay.prototype._update_display_items = function () {
  var items_count = this.items.total_count();
  for (var i = 0; i < items_count; i++) {
    var item = this.items.product_by_index(i);
    var $item_ele = this.$ele.find('.holding-item').eq(i);
    
    $item_ele.removeClass('holding-item-disabled')
    .attr('title', 'Remove '+item.title)
    .attr('data-phd-item-id', item.id)
    .data('phd-item-id', item.id);
    
    if(item.color){
      $item_ele.find('path').css({
        fill: ((item.color[0] !== '#')? '#': '')+item.color
      });
    }
  }
};

SixPackHolderItemsDisplay.prototype._scroll_container = function () {
  var $group = $('.holding-item-group');
  var group_margin = parseInt($group.css('margin-left')) + parseInt($group.css('margin-right'));
  var group_combined_width = ($group.width() + group_margin) * $group.length;
  
  var $container = $group.parent();
  var offset = group_combined_width - $container.width();
  
  this.$ele.animate({
    scrollLeft: offset
  }, 186);
};

SixPackHolderItemsDisplay.prototype._add_tooltips = function () {
  $(this.tooltip_selector).tooltip();
};

SixPackHolderItemsDisplay.prototype._remove_tooltips = function () {
  $(this.tooltip_selector).tooltip('destroy');
};

SixPackHolderItemsDisplay.prototype._remove_item = function (e) {  
  var $currentTarget = $(e.currentTarget);
  if (!$currentTarget.hasClass('holding-item-disabled')) {
    var args = [
      $currentTarget.data('phd-item-id')
    ];
    this.trigger('RemoveDisplayItem', args);
  }
};

module.exports = SixPackHolderItemsDisplay;