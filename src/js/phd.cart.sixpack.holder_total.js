var DataModel = require('./_data_model.js');

var SixPackHolderTotal = function (items) {
  this.items = items;
  
  new DataModel(this, {
    limit: '[data-phd-holding-items-limit]',
    total_items: '[data-phd-holding-total-items]',
    total_price: '[data-phd-holding-total-price]'
  });
  
  this._add_event_listeners();
  this.update();
};

SixPackHolderTotal.prototype.update = function () {
  this.total_items = this.items.total_count();
  this.total_price = this.items.total_price();
  
  // total of limit
  var limit = this.items.limit_multiple * (Math.ceil(this.total_items / this.items.limit_multiple));
  this.limit = (limit > 0)? limit : this.items.limit_multiple;
};

// Private

SixPackHolderTotal.prototype._add_event_listeners = function () {
  var _this = this;
  _this.items.on('ItemsUpdated', function () {
    _this.update();
  });
};

module.exports = SixPackHolderTotal;