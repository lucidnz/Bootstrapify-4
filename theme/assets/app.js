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
  var item_count = 0;
  
  // product vars
  var product_form_id = '#'+Bsify.product_form_id;
  var $product_form_ele = $(document.getElementById(Bsify.product_form_id));
  var $product_form_button = $product_form_ele.find('input[type=submit]');
  var $product_form_message_ele = $(document.getElementById(Bsify.product_form_message_id));
  
  // cart vars
  var $cart_display_ele = $(Bsify.cart_display_item);
  
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
    // update add to cart button text
    $product_form_button.val(Bsify.adding_to_cart_button_text);
  });
  
  $(document).on('cart.requestComplete', function(event, cart) {
    item_count++;
    // update add to cart button text
    $product_form_button.val(Bsify.added_to_cart_button_text);
    
    // add completd message
    // TODO: update message item title with actual items title - waiting on CartJS to include the item with the event handlers params
    var added_message = Bsify.after_product_added_message_html.replace('[item_title]', 'item').replace('[collection_url]', Bsify.after_product_added_message_collection_url);
    $product_form_message_ele.removeClass('hidden').html('<div class="note success item'+item_count+'">'+added_message+'</div>');
    // fade out and remove item added message
    setTimeout(function () {
      $product_form_message_ele.find('.item'+item_count).fadeOut(function () {
        $(this).remove();
      });
    }, Bsify.add_to_cart_message_timeout);
    
    // update the cart note in the navbar
    var cart_total_price = Shopify.formatMoney(cart.total_price, Bsify.formats.moneyFormat);
    var cart_total_price_with_currency = Shopify.formatMoney(cart.total_price, Bsify.formats.moneyWithCurrencyFormat);
    var cart_display_text = Bsify.cart_display_text.replace('[item_count]', cart.item_count).replace('[cart_total_price]', cart_total_price).replace('[cart_total_price_with_currency]', cart_total_price_with_currency);
    
    
    console.log($cart_display_ele, cart_display_text);
    
    $cart_display_ele.html(cart_display_text);
  });
}

/*
  Cart utils
*/

// Check cart for variant
Bsify.cart_has_variant = function (variant_id) {
  var has_variant = false;
  if (CartJS) {
    for (var i = 0; i < CartJS.cart.items.length; i++) {
      var item = CartJS.cart.items[i];
      if (item.variant_id === variant_id) {
        has_variant = true;
      }
    }
  }
  return has_variant;
};