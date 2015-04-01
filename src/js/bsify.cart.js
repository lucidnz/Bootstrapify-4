var CartJS = require('shopify-cartjs');

var Cart = {};
var message_count = 0;

// Cart vars
var $cart_display_ele = $('[data-cart-display]');
var $cart_total_ele = $('[data-cart-total]');
var $cart_form_ele = $(Bsify.selectors.cart.form_selector);
var $cart_message_ele = $(Bsify.selectors.cart.message_selector);

// product vars
if (Bsify.product) {
  var $product_form_ele = $(Bsify.selectors.product.form_selector);
  var $product_form_button = $product_form_ele.find('input[type=submit]');
  var $product_form_message_ele = $(Bsify.selectors.product.form_message_selector);
}

// Set up cart event handlers
Cart.init = function () {
  
  // fired when the CartJS object has finished updating the cart
  $(document).on('cart.requestComplete', function(event, cart) {
    // update the cart note in the navbar
    Cart.update_cart_display();
    Cart.update_cart_table();
  });
  
  // Ajax add to cart from product template
  if (Bsify.product) {
    // Capture the form submit
    $(document).on('submit', Bsify.selectors.product.form_selector, function (e) {
      e.preventDefault();
      var $current_target = $(e.currentTarget);
      Cart.add_item_to_cart($current_target);
    });
  }
  
  // remove item from cart
  $(document).on('click', '[data-remove-item]', function (e) {
    e.preventDefault();
    var $current_target = $(e.currentTarget);
    Cart.remove_item_from_cart($current_target);
  });
};

/*
  Cart methods
*/

Cart.add_item_to_cart = function ($current_target) {
  var values = Cart.form_values($current_target.serializeArray());
  var properties = {}; // TODO: deal with item properties when adding to cart
  
  var variant = Bsify.get_variant_by_id(values.id);
  var item_title = Bsify.product.title + Bsify.translations.product.item_title_seperator + variant.title;
  
  // update the user that we are working on it
  $product_form_button.val(Bsify.translations.product.adding_to_cart_button_text);
  
  // add the item to the cart
  CartJS.addItem(values.id, values.quantity, properties, {
    "success" : function (data, text_status, jqXHR) {
      
      // create and display completed message
      var message = Bsify.translations.product.after_product_added_message_html.replace('[item_title]', item_title);
      Cart.show_message($product_form_message_ele, 'success', message);
      
      // update add to cart button text
      $product_form_button.val(Bsify.translations.product.added_to_cart_button_text);
      
    },
    "error": function(jqXHR, text_status, error_thrown) {
      console.log('[ERROR] - Add to cart:', jqXHR, text_status, error_thrown);
      
      // create and display error message
      var message = Bsify.translations.product.after_product_added_error_message_html.replace('[item_title]', item_title).replace('[error_message]', error_thrown);
      Cart.show_message($product_form_message_ele, 'error', message);
      
      // update add to cart button text
      $product_form_button.val(Bsify.translations.product.unavailable_button_text);
    }
  });
};

Cart.remove_item_from_cart = function ($current_target) {
  var $cart_item_ele = $current_target.closest(Bsify.selectors.cart.item_selector);
  
  var item = Cart.get_item_by_id($cart_item_ele.data('cart-item'));
  var item_title = item.product_title + Bsify.translations.product.item_title_seperator + item.variant_title;
  
  CartJS.removeItem($current_target.data('remove-item'), {
    "success": function (data, text_status, jqXHR) {
      // hide item row
      $cart_item_ele.hide();
      
      // Show user a nice message
      var message = Bsify.translations.cart.remove_item_message.replace('[item_title]', item_title);
      Cart.show_message($cart_message_ele, 'success', message);
      
    },
    "error": function (jqXHR, text_status, error_thrown) {
      console.log('[ERROR] - Remove item from cart:', jqXHR, text_status, error_thrown);
      
      // Show user a nice message
      var message = Bsify.translations.cart.remove_item_error_message.replace('[item_title]', item_title).replace('[error_message]', error_thrown);
      Cart.show_message($cart_message_ele, 'success', message);
    } 
  });
};

/*
  Display methods
*/

// Update cart display with the current cart details
Cart.update_cart_display = function () {
  var cart_total_price = Shopify.formatMoney(CartJS.cart.total_price, Bsify.money_formats.moneyFormat);
  var cart_total_price_with_currency = Shopify.formatMoney(CartJS.cart.total_price, Bsify.money_formats.moneyWithCurrencyFormat);
  
  var cart_display_text = Bsify.translations.cart.cart_display_text.replace('[item_count]', CartJS.cart.item_count).replace('[cart_total_price]', cart_total_price).replace('[cart_total_price_with_currency]', cart_total_price_with_currency);
  $cart_display_ele.html(cart_display_text);
  
  var cart_total_text = Bsify.translations.cart.cart_total.replace('[cart_total_price]', cart_total_price).replace('[cart_total_price_with_currency]', cart_total_price_with_currency);
  $cart_total_ele.html(cart_total_text);
};

// hide the cart table if the cart is empty
Cart.update_cart_table = function () {
  if (CartJS.cart.item_count === 0) {
    $cart_form_ele.hide();
    $cart_message_ele.removeClass('hidden').html(Bsify.translations.cart.empty_cart_text);
  }
};

// show and hide feedback mesages for cart actions
Cart.show_message = function ($message_ele, message_class, message) {
  message_count++;
  $message_ele.removeClass('hidden').html('<div class="note '+message_class+' message'+message_count+'">'+message+'</div>');
  Cart.remove_message(message_count);
};

Cart.remove_message = function (message_id) {
  setTimeout(function () {
    $('.message'+message_id).fadeOut(function () {
      $(this).remove();
    });
  }, Bsify.message_timeout);
};

// convert jQuery serializeArray results into something useful 
Cart.form_values = function (arr) {
  var vals = {};
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    vals[item.name] = item.value;
  }
  return vals;
};

/*
  Cart utility functions
*/

// Get item from CartJS by variant id
Cart.get_item_by_id = function (variant_id) {
  if (typeof variant_id === 'string') variant_id = parseInt(variant_id);
  var line_item;
  if (CartJS) {
    for (var i = 0; i < CartJS.cart.items.length; i++) {
      var item = CartJS.cart.items[i];
      if (item.variant_id === variant_id) {
        line_item = item;
      }
    }
  }
  return line_item;
};

// Check cart for variant
Cart.has_variant = function (variant_id) {
  if (typeof variant_id === 'string') variant_id = parseInt(variant_id);
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

module.exports = Cart;