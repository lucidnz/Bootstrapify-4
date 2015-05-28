var DataModel = require('./_data_model.js');

var StandardCartDisplay = function (cart_action_selector) {
  this.cart_action_selector = cart_action_selector;
  
  this._add_event_listenters();
};

StandardCartDisplay.prototype.toggle_draw = function (action) {
  console.log('toggle cart draw');
  
  if (action !== undefined && this[action+'_draw'] !== undefined) { // open / close
    this[action+'_draw'].apply(this);
  } else {
    
  }
};

StandardCartDisplay.prototype.open_draw = function () {
  console.log('open cart draw');
};

StandardCartDisplay.prototype.close_draw = function () {
  console.log('close cart draw');
};

// Private

StandardCartDisplay.prototype._add_event_listenters = function () {
  var _this = this;
  
  $(document).on('click', this.cart_action_selector, function (e) {
    e.preventDefault();
    _this.toggle_draw();
  });
};

module.exports = StandardCartDisplay;