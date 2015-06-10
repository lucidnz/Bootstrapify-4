var CartDisplay = require('./phd.cart.standard_display.js');
var CartOffCanvas = require('./phd.cart.standard_offcanvas.js');

var StandardCart = function () {
  
  var cart_action_selector = 'a[href="/cart"]';
  this.off_canvas = new CartOffCanvas(cart_action_selector);
  
  this.display = new CartDisplay();
};

StandardCart.prototype.add_products = function (products) {
  console.log('StandardCart:add_products', products);
};

module.exports = StandardCart;