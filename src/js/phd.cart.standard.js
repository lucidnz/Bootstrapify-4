var CartDisplay = require('./phd.cart.standard_display.js');

var StandardCart = function () {
  
  var cart_action_selector = 'a[href="/cart"]';
  this.display = new CartDisplay(cart_action_selector);
};

StandardCart.prototype.add_products = function (products) {
  console.log('StandardCart:add_products', products);
};

module.exports = StandardCart;