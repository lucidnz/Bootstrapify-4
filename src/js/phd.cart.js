//var AddTo = require('./phd.cart.add_to.js');
//var HoldingCart = require('./phd.cart.holding.js');
var HoldingCart = require('./phd.cart.add_to.holding.js');
var ShoppingCart = require('./phd.cart.shopping.js');

var PhdCart = function () {
//   this.cart_action_ele = $('[data-phd-add-to]');
  
  new HoldingCart();
  
  //this.holding_cart = new HoldingCart();
  this.shopping_cart = new ShoppingCart();
  
  //var _this = this;
  
  
  
  
  // make this into it's own class
  
/*
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
*/
  
  
  
  
  
  
  
//   this._init_cart_actions();
};

/*
PhdCart.prototype._init_cart_actions = function () {
  var _this = this;
  // make each cart action on the page an AddTo class
  _this.cart_action_ele.each(function () {
    var cart_action = new AddTo(this);
    
    // when the cart action is triggered add its variants to the correct actions cart object
    cart_action.on('addTo', function (action, variant_id) {
      switch (action) {
        case 'holding':
          _this.holding_cart.add_product(variant_id);
          break;
        
        case 'cart':
          _this.shopping_cart.add_product(variant_id);
          break;
      }
    });
  });
};
*/

module.exports = PhdCart;