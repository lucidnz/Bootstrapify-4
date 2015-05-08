var PhdSticky = require('./phd.sticky.js');
var PhdCart = require('./phd.cart.js');

var Phd = function () {
  new PhdSticky();
  new PhdCart();
};

module.exports = Phd;