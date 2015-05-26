/* ToDo: check the modal isn't already open */
var Eventer = require('./_eventer.js');
var DataModel = require('./_data_model.js');

var PhdModal = function (selector) {
  this.selector = selector || '[data-bsify-modal]';
  this.$ele = $(this.selector);
  
  new Eventer(this);
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
  this.trigger('ModalOpened');
};

PhdModal.prototype.close = function () {
  this.$ele.modal('hide');
  this.trigger('ModalClosed');
  this.destroy();
};

PhdModal.prototype.destroy = function () {
  this.content = '';
};

// Private

PhdModal.prototype._add_event_listeners = function () {
  var _this = this;
  this.$ele.on('hidden.bs.modal', function (e) {
    
    // EHH?! event is beign fired a million bajillion times
    
    console.log('modal closed', e);
    _this.trigger('ModalClosed');
    _this.destroy();
  });
};

module.exports = PhdModal;