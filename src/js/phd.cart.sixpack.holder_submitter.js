/*jshint multistr: true */

var Eventer = require('./_eventer.js');
var Modal = require('./phd.modal.js');

var SixPackHolderItemSubmitter = function ($ele, items) {
  new Eventer(this);
  this.$ele = $ele;
  this.items = items;
  this.$submit = $ele.find('[type="submit"]');
  this.modal = new Modal({
    on_open: function () {
      console.log('submitter modal open');
    },
    on_close: function () {
      console.log('submitter modal close');
    }
  });
  
  this._add_event_listeners();
};

SixPackHolderItemSubmitter.prototype._add_event_listeners = function () {
  var _this = this;
  
  _this.$ele.on('submit', function (e) {
    e.preventDefault();
    _this._open_modal();
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
  this.modal.content = this._modal_markup();
  this.modal.open();
};

SixPackHolderItemSubmitter.prototype._modal_markup = function () {
  return '<div class="modal-header">\
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="fa fa-times" aria-hidden="true"></span></button>\
    <h1>How do you want to get your order?</h1>\
  </div>\
  <div class="modal-body">\
    <button type="button" class="btn btn-default btn-lg" data-dismiss="modal"><strong>Add to cart</strong> as a one off purcahse</button>\
    <button type="button" class="btn btn-primary btn-lg" data-dismiss="modal">Get $10 off your order if you <strong>Subscribe now!</strong></button>\
  </div>';
};

module.exports = SixPackHolderItemSubmitter;