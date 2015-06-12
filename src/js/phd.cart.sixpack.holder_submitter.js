/*jshint multistr: true */

var Eventer = require('./_eventer.js');
var Modal = require('./phd.modal.js');

var SixPackHolderItemSubmitter = function ($ele, items) {
  new Eventer(this);
  this.$ele = $ele;
  this.items = items;
  this.$submit = $ele.find('[type="submit"]');
  this.modal = new Modal();
  
  this._add_event_listeners();
};

SixPackHolderItemSubmitter.prototype._add_event_listeners = function () {
  var _this = this;
  
  _this.$ele.on('submit', function (e) {
    e.preventDefault();
    _this._open_modal();
  });
  
  $(document).on('click', '[data-phd-add-to-cart-as]', function (e) {
    var $current_target = $(e.currentTarget);
    var purchase_type = $current_target.data('phd-add-to-cart-as');
    
    _this.trigger('AddToCart', [purchase_type]);
    
    //_this.modal.content = _this._completed_modal_markup(purchase_type); <-- update modal content
    _this.modal.close();
  });
  
  _this.items.on('ItemsUpdated', function () {
    _this._toggle_submitablity();
  });
};

SixPackHolderItemSubmitter.prototype._toggle_submitablity = function () {
  if (this.items.products_are_addable) {
    this.$submit.prop('disabled', false);
  } else {
    this.$submit.prop('disabled', true);
  }
};

SixPackHolderItemSubmitter.prototype._open_modal = function () {  
  this.modal.content = this._add_to_cart_modal_markup();
  this.modal.open();
};

// TODO: Don't have this markup in here
SixPackHolderItemSubmitter.prototype._add_to_cart_modal_markup = function () {
  return '<div class="modal-header">\
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="fa fa-times" aria-hidden="true"></span></button>\
    <h1>How do you want to get your order?</h1>\
  </div>\
  <div class="modal-body">\
    <button type="button" class="btn btn-default btn-lg" data-phd-add-to-cart-as="single"><strong>Add to cart</strong> as a one off purcahse</button>\
    <button type="button" class="btn btn-primary btn-lg" data-phd-add-to-cart-as="subscription">Get $10 off your order if you <strong>Subscribe now!</strong></button>\
  </div>';
};

SixPackHolderItemSubmitter.prototype._completed_modal_markup = function (purchase_type) {
  return '<div class="modal-header">\
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="fa fa-times" aria-hidden="true"></span></button>\
    <h1>Thanks, your order is being added to the cart</h1>\
  </div>\
  <div class="modal-body">\
    <p>'+purchase_type+'</p>\
  </div>';
};

module.exports = SixPackHolderItemSubmitter;