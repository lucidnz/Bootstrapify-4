var CartJS = require('shopify-cartjs');
var CartDisplay = require('./phd.cart.standard_display.js');
var CartOffCanvas = require('./phd.cart.standard_offcanvas.js');

var StandardCart = function () {
  
  var cart_action_selector = 'a[href="/cart"]';
  this.off_canvas = new CartOffCanvas(cart_action_selector);
  
  this.display = new CartDisplay();
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

StandardCart.prototype._item_added_success = function (data, textStatus, jqXHR) {
//   console.log('Item added: success', data, textStatus, jqXHR);
  this.display.update_cart_item(data);
};

StandardCart.prototype._item_added_error = function (jqXHR, textStatus, errorThrown) {
  console.log('Item added: error', jqXHR, textStatus, errorThrown);
  // display error
};

module.exports = StandardCart;