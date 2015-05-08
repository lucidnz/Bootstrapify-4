/*
var Eventer = require('./eventer.js');

var PhdAddTo = function (ele) {
  this.ele = $(ele);
  new Eventer(this);
  
  this._add_event_listeners();
};

PhdAddTo.prototype._add_event_listeners = function () {
  var _this = this;
  _this.ele.on('click', function (e) {
    e.preventDefault();
    
    // TODO:
    // update button text
    
    _this._trigger_add_to();
  });
};

PhdAddTo.prototype._trigger_add_to = function () {
  var args = [
    this.ele.data('phd-add-to'),
    this.ele.data('phd-variant-id')
  ];
  this.trigger('addTo', args);
};

module.exports = PhdAddTo;
*/