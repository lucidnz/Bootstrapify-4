/* ToDo: check the modal isn't already open */
var DataModel = require('./_data_model.js');

var PhdModal = function (callbacks, selector) {
  this.callback_events = ['on_open','on_close'];
  this.selector = selector || '[data-bsify-modal]';
  this.$ele = $(this.selector);
  this.id = this._id();
  
  new DataModel(this, {
    content: this.selector+' .modal-content'
  });
  
  this._set_callbacks(callbacks);
  this._add_event_listeners();
};

PhdModal.prototype.open = function () {
  this.$ele.modal();
  this.$ele.data('modal_id', this.id);
  if (this.on_open) this.on_open();
};

PhdModal.prototype.close = function () {
  this.$ele.modal('hide');
  this.destroy();
};

PhdModal.prototype.destroy = function () {
  if (this.on_close) this.on_close();
  this.content = '';
  this.$ele.data('bs.modal', null);
  this.$ele.data('modal_id', null);
};

// Private

PhdModal.prototype._add_event_listeners = function () {
  var _this = this;
  this.$ele.on('hidden.bs.modal', function () {
    // Only trigger this for the one object that invoked the modal
    if (_this.$ele.data('modal_id') === _this.id) {
      _this.destroy();
    }
  });
};

PhdModal.prototype._set_callbacks = function (callbacks) {
  if (callbacks) {
    for (var i in this.callback_events) {
      var event = this.callback_events[i];
      if (callbacks[event]) {
        this[event] = callbacks[event];
      }
    }
  }
};

PhdModal.prototype._id = function () {
  // https://gist.github.com/gordonbrander/2230317
  return '_' + Math.random().toString(36).substr(2, 9);
};

module.exports = PhdModal;