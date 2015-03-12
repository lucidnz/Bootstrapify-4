/*
  Init CartJS
   - Because we are loading these files asynchronously we have to
     double check that we actually have the object before we call it.
*/
var CartJS = CartJS || false;

Bsify.init_cart = function () {
  if (CartJS) {
    CartJS.init(Bsify.cart, Bsify.formats);
  } else {
    setTimeout( function () {
      Bsify.init_cart();
    }, 10);
  }
};

Bsify.init_cart();

/*
  Ajax add to cart
*/

if (Bsify.product_form_id !== undefined && Bsify.ajax_add_to_cart) {
  var product_form_id = '#'+Bsify.product_form_id;
  
  var form_values = function (arr) {
    var vals = {};
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      vals[item.name] = item.value;
    }
    return vals;
  };
  
  // Capture the form submit
  $(document).on('submit', product_form_id, function (e) {
    e.preventDefault();
    var $current_target = $(e.currentTarget);
    var values = form_values($current_target.serializeArray());
    // add the item to the cart
    CartJS.addItem(values.id, values.quantity);
  });
  
  // TODO: add to cart events
  $(document).on('cart.requestStarted', function(event, cart) {
    // Event handling here.
  });
  
  $(document).on('cart.requestComplete', function(event, cart) {
    // Event handling here.
  });
}

/*
  Cart utils
*/

// Check cart for variant
Bsify.cart_has_variant = function (variant_id) {
  var has_variant = false;
  for (var i = 0; i < CartJS.cart.items.length; i++) {
    var item = CartJS.cart.items[i];
    if (item.variant_id === variant_id) {
      has_variant = true;
    }
  }
  return has_variant;
};