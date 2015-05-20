var AddTo = require('./phd.cart.add_to.js');
var HoldingCart = require('./phd.cart.holding.js');

var PhdAddToHolding = function () {
  this.holding_cart = new HoldingCart();
  var _this = this;
  
  $('[data-phd-add-to="holding"]').each(function () {
    var cart_action = new AddTo(this);
    
    cart_action.args = function () {
      return [
        {
          id: cart_action.$ele.data('phd-variant-id'),
          title: cart_action.$ele.attr('title')
        }
      ];
    };
    
    cart_action.on('addTo', function (variant) {
      _this.holding_cart.add_product(variant);
      
      // update button stuffs
    });
  });
};

module.exports = PhdAddToHolding;