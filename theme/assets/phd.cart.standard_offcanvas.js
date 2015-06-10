var Cookies = require('./_cookies.js');

var StandardCartOffCanvas = function (cart_action_selector) {
  this.cart_action_selector = cart_action_selector;
  this.offcanavs_class = 'offcanvas-open';
  this.$body = $('body');
  
  this._add_event_listenters();
  
  if (Cookies.hasItem('cart_state')) {
    var action = Cookies.getItem('cart_state');
    this.toggle_draw(action);
  }
};

StandardCartOffCanvas.prototype.toggle_draw = function (action) {
  // actions: open / close
  if (action !== undefined && this[action+'_draw'] !== undefined) {
    this[action+'_draw'].apply(this);
  } else {
    if (this.$body.hasClass(this.offcanavs_class)) {
      this.close_draw();
    } else {
      this.open_draw();
    }
  }
};

StandardCartOffCanvas.prototype.open_draw = function () {
  this.$body.addClass(this.offcanavs_class);
  Cookies.setItem('cart_state', 'open');
  $(window).trigger('resize');
};

StandardCartOffCanvas.prototype.close_draw = function () {
  this.$body.removeClass(this.offcanavs_class);
  Cookies.setItem('cart_state', 'close');
  $(window).trigger('resize');
};

// Private

StandardCartOffCanvas.prototype._add_event_listenters = function () {
  var _this = this;
  $(document).on('click', this.cart_action_selector, function (e) {
    e.preventDefault();
    _this.toggle_draw();
  });
};

module.exports = StandardCartOffCanvas;