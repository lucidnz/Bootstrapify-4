var Eventer = require('./_eventer.js');

var PhdAddTo = function (ele) {
  this.ele = ele;
  this.$ele = $(ele);
  new Eventer(this);
  
  this._add_event_listeners();
};

PhdAddTo.prototype.args = function () {
  return [];
};

PhdAddTo.prototype._add_event_listeners = function () {
  var _this = this;
  
  if (_this._ele_tag_name() === 'a') {
    _this.$ele.on('click', function (e) {
      e.preventDefault();
      _this._trigger_add_to();
      _this.$ele.blur();
    });
    
  } else { // is input
    _this.$ele.closest('form').on('submit', function (e) {
      e.preventDefault();
      _this._trigger_add_to();
    });
    
  }
};

PhdAddTo.prototype._trigger_add_to = function () {
  var args = this.args();
  this.trigger('addTo', args);
};

PhdAddTo.prototype._ele_tag_name = function () {
  return this.ele.tagName.toLowerCase();
};

module.exports = PhdAddTo;