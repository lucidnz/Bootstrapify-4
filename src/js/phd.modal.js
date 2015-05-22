/* ToDo: check the modal isn't already open */

var PhdModal = function (content, selector) {
  this.content = content;
  this.selector = selector || '[data-bsify-modal]';
  this.$ele = $(this.selector);
  
  this.$ele.modal({
    show: false
  });
  
  this._add_event_listeners();
};

PhdModal.prototype.open = function () {
  this.$ele.find('.modal-content').html(this.content);
  this.$ele.modal('show');
};

PhdModal.prototype.close = function () {
  this.$ele.modal('hide');
  this.destroy();
};

PhdModal.prototype.destroy = function () {
  // TODO: init on close callback
  
  this.$ele.find('.modal-content').html('');
};

// Private

PhdModal.prototype._add_event_listeners = function () {
  var _this = this;
  this.$ele.on('hidden.bs.modal', function (e) {
    _this.destroy();
  });
};

module.exports = PhdModal;