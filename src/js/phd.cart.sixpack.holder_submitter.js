var Eventer = require('./_eventer.js');
var Modal = require('./phd.modal.js');

var SixPackHolderItemSubmitter = function ($ele, items) {
  new Eventer(this);
  this.$ele = $ele;
  this.items = items;
  this.$submit = $ele.find('[type="submit"]');
  
  this._init_modal();
  this._add_event_listeners();
};

SixPackHolderItemSubmitter.prototype._add_event_listeners = function () {
  var _this = this;
  
  _this.$ele.on('submit', function (e) {
    e.preventDefault();
    _this.modal.open();
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

SixPackHolderItemSubmitter.prototype._init_modal = function () {  
  var modal_markup = this._modal_markup();
  this.modal = new Modal(modal_markup);
};

SixPackHolderItemSubmitter.prototype._modal_markup = function () {
  return 'MODAL';
};

module.exports = SixPackHolderItemSubmitter;