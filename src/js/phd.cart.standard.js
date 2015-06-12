var CartJS = require('shopify-cartjs');
var CartDisplay = require('./phd.cart.standard_display.js');
var CartOffCanvas = require('./phd.cart.standard_offcanvas.js');

var StandardCart = function () {
  var cart_action_selector = 'a[href="/cart"]';
  this.off_canvas = new CartOffCanvas(cart_action_selector);
  this.display = new CartDisplay();
  
  this._add_event_listeners();
};

StandardCart.prototype.add_products = function (products) {
  // products is an array full of products that are ready to go
  for (var key in products) {
    if (products.hasOwnProperty(key)) {
      var product = products[key];
      this.add_product(product);
    }
  }
};

StandardCart.prototype.add_product = function (product) {
  var _this = this;
  
  // quick display update
  // TODO: FUTURE STEWART!!!! QUICK ADD IS NOT QUICK ADDING 
  _this.display.update_cart_item(product);
  
  
  // actually add to cart
  CartJS.addItem(product.id, product.qty, product.properties, {
    success: function (data, textStatus, jqXHR) {
      _this._item_added_success(data, textStatus, jqXHR);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      _this._item_added_error(jqXHR, textStatus, errorThrown);
    }
  });
};

// Private

StandardCart.prototype._add_event_listeners = function () {
  var _this = this;
  $(document).on('cart.requestComplete', function(e, cart) {
    console.log('cart.requestComplete', e, cart);
    _this.display.update(cart);
  });
};

StandardCart.prototype._item_added_success = function (data, textStatus, jqXHR) {
  // collect last added items for succes message
  // console.log('Item added: success', data, textStatus, jqXHR);
};

StandardCart.prototype._item_added_error = function (jqXHR, textStatus, errorThrown) {
  // display error
  console.log('Item added: error', jqXHR, textStatus, errorThrown);
};

module.exports = StandardCart;
window.CartJS = CartJS;