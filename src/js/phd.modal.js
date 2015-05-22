/* ToDo: check the modal isn't already open */
var DataModel = require('./_data_model.js');

var PhdModal = function (selector) {
  this.selector = selector || '[data-bsify-modal]';
  this.$ele = $(this.selector);
  
  new DataModel(this, {
    content: this.selector+' .modal-content'
  });
  
  this.$ele.modal({
    show: false
  });
  
  this._add_event_listeners();
};

PhdModal.prototype.open = function () {
  this.$ele.modal('show');
};

PhdModal.prototype.close = function () {
  this.$ele.modal('hide');
  this.destroy();
};

PhdModal.prototype.destroy = function () {
  // TODO: init on_close callback
  this.content = '';
};

// Private

PhdModal.prototype._add_event_listeners = function () {
  var _this = this;
  this.$ele.on('hidden.bs.modal', function (e) {
    _this.destroy();
  });
};

module.exports = PhdModal;