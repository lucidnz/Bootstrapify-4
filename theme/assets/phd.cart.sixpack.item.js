var Eventer = require('./_eventer.js');
var DataModel = require('./_data_model.js');
var Modal = require('./phd.modal.js');

var SixPackItem = function ($ele, id) {
  this.$ele = $ele;
  this.id = id;
  
  new Eventer(this);
  new DataModel(this, {
    holding_count: '[data-phd-item-'+this.id+'-count]'
  });
  
  this.modal = new Modal();
  
  this.variant_id = this.$ele.data('phd-variant-id');
  this.product_title = this.$ele.data('phd-product-title');
  this.product_price = this.$ele.data('phd-product-price');
  this.product_color = this.$ele.data('phd-product-color');
  
  this.product = {
    id: this.variant_id,
    title: this.product_title,
    price: this.product_price,
    color: this.product_color
  };
  
  this._add_event_listeners();
};

// Private

SixPackItem.prototype._add_event_listeners = function () {
  var _this = this;
  _this.$ele.on('click', '[data-phd-add-item]', function (e) {
    e.preventDefault();
    e.currentTarget.blur();
    _this._trigger_add_to();
  });
  
  _this.$ele.on('click', '[data-phd-remove-item]', function (e) {
    e.preventDefault();
    e.currentTarget.blur();
    _this._trigger_remove_from();
  });
  
  _this.$ele.on('blur', '[data-phd-edit-item]', function (e) {
    var qty = parseInt(e.currentTarget.value);
    _this._trigger_update_holding(qty);
  });
  
  _this.$ele.on('click', '[data-phd-modal]', function (e) {
    e.preventDefault();
    var $current_target = $(e.currentTarget);
    var content_url = $current_target.attr('href');
    _this.modal.open();
    $.ajax(content_url).done(function (data) {
      _this.modal.content = data;
    });
  });
};

SixPackItem.prototype._trigger_add_to = function () {
  var args = [
    this.product
  ];
  this.trigger('AddToHolding', args);
};

SixPackItem.prototype._trigger_remove_from = function () {
  var args = [
    this.variant_id
  ];
  this.trigger('RemoveFromHolding', args);
};

SixPackItem.prototype._trigger_update_holding = function (qty) {
  var args = [
    this.product,
    qty
  ];
  this.trigger('UpdateHolding', args);
};

module.exports = SixPackItem;