/*
  Bootstrapify utility methods
*/

Bsify.get_variant_by_id = function (variant_id) {
  var selected_variant;
  if (typeof variant_id === 'string') variant_id = parseInt(variant_id);
  
  for (var i = 0; i < Bsify.product.variants.length; i++) {
    var variant = Bsify.product.variants[i];
    if (variant.id === variant_id) {
      selected_variant = variant;
    }
  }
  return selected_variant;
};


/*
  Init CartJS
   - Because we are loading these files asynchronously we have to
     double check that we actually have the object before we call it.
*/
var CartJS = CartJS || false;

Bsify.init_cart = function () {
  if (CartJS) {
    CartJS.init(Bsify.cart, Bsify.money_formats);
  } else {
    setTimeout( function () {
      Bsify.init_cart();
    }, 10);
  }
};

if (Bsify.ajax_add_to_cart) {
  Bsify.init_cart();
  
  /*
    Working with CartJS
  */
  
  // Cart vars
  var $cart_display_ele = $('[data-cart-display]');
  var $cart_table_ele = $(Bsify.cart_table_selector);
  var $cart_message_ele = $(Bsify.cart_message_selector);
  
  // Update cart display with the current cart details
  Bsify.update_cart_display = function () {
    var cart_total_price = Shopify.formatMoney(CartJS.cart.total_price, Bsify.money_formats.moneyFormat);
    var cart_total_price_with_currency = Shopify.formatMoney(CartJS.cart.total_price, Bsify.money_formats.moneyWithCurrencyFormat);
    var cart_display_text = Bsify.cart_display_text.replace('[item_count]', CartJS.cart.item_count).replace('[cart_total_price]', cart_total_price).replace('[cart_total_price_with_currency]', cart_total_price_with_currency);
    $cart_display_ele.html(cart_display_text);
  };
  
  Bsify.update_cart_table = function () {
    if (CartJS.cart.item_count === 0) {
      $cart_table_ele.hide();
      $cart_message_ele.removeClass('hidden').html(Bsify.empty_cart_text);
    }
  };
  
  $(document).on('cart.requestComplete', function(event, cart) {
    // update the cart note in the navbar
    Bsify.update_cart_display();
    Bsify.update_cart_table();
  });
  
  var message_count = 0;
  Bsify.show_message = function ($message_ele, message_class, message) {
    message_count++;
    $message_ele.removeClass('hidden').html('<div class="note '+message_class+' message'+message_count+'">'+message+'</div>');
    Bsify.remove_message(message_count);
  };
  
  Bsify.remove_message = function (message_id) {
    setTimeout(function () {
      $('.message'+message_id).fadeOut(function () {
        $(this).remove();
      });
    }, Bsify.message_timeout);
  };
  
  /*
    Ajax add product to cart
  */
  
  // if we are on the product page and we want ajax add to cart
  if (Bsify.product) {
    
    // product vars
    var $product_form_ele = $(Bsify.product_form_selector);
    var $product_form_button = $product_form_ele.find('input[type=submit]');
    var $product_form_message_ele = $(Bsify.product_form_message_selector);
    
    // convert jQuery serializeArray results into something useful
    var form_values = function (arr) {
      var vals = {};
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        vals[item.name] = item.value;
      }
      return vals;
    };
    
    // Capture the form submit
    $(document).on('submit', Bsify.product_form_selector, function (e) {
      e.preventDefault();
      // Get the product details to send to the cart.
      var $current_target = $(e.currentTarget);
      var values = form_values($current_target.serializeArray());
      var properties = {}; // TODO: deal with item properties when adding to cart
      
      var variant = Bsify.get_variant_by_id(values.id);
      var item_title = Bsify.product.title + Bsify.item_title_seperator + variant.title;
      
      // update the user that we are working on it
      $product_form_button.val(Bsify.adding_to_cart_button_text);
      
      // add the item to the cart
      CartJS.addItem(values.id, values.quantity, properties, {
        "success" : function (data, text_status, jqXHR) {
          
          // create and display completed message
          var message = Bsify.after_product_added_message_html.replace('[item_title]', item_title);
          Bsify.show_message($product_form_message_ele, 'success', message);
          
          // update add to cart button text
          $product_form_button.val(Bsify.added_to_cart_button_text);
          
        },
        "error": function(jqXHR, text_status, error_thrown) {
          console.log('[ERROR] - Add to cart:', jqXHR, text_status, error_thrown);
          
          // create and display error message
          var message = Bsify.after_product_added_error_message_html.replace('[item_title]', item_title).replace('[error_message]', error_thrown);
          Bsify.show_message($product_form_message_ele, 'error', message);
          
          // update add to cart button text
          $product_form_button.val(Bsify.unavailable_button_text);
        }
      });
    });
  }

  /*
    Ajax update cart
  */

  /* TODO: update cart with item quantity - I want to do it on key up but I don't want to update it on every keyup i.e. 100 (don't trigger on 1 & 10) */
  // update item quantity
  
  // remove item from cart
  $(document).on('click', '[data-remove-item]', function (e) {
    e.preventDefault();
    var $current_target = $(e.currentTarget);
    var $cart_item_ele = $current_target.closest(Bsify.cart_item_selector);
    
    var item = Bsify.get_cart_item_by_id($cart_item_ele.data('cart-item'));
    var item_title = item.product_title + Bsify.item_title_seperator + item.variant_title;
    
    CartJS.removeItem($current_target.data('remove-item'), {
      "success": function (data, text_status, jqXHR) {
        // hide item row
        $cart_item_ele.hide();
        
        // Show user a nice message
        var message = Bsify.remove_item_message.replace('[item_title]', item_title);
        Bsify.show_message($cart_message_ele, 'success', message);
        
      },
      "error": function (jqXHR, text_status, error_thrown) {
        console.log('[ERROR] - Remove item from cart:', jqXHR, text_status, error_thrownn);
        
        // Show user a nice message
        var message = Bsify.remove_item_error_message.replace('[item_title]', item_title).replace('[error_message]', error_thrown);
        Bsify.show_message($cart_message_ele, 'success', message);
      } 
    });
  });
}

/*
  Cart utility functions
*/

// Get item from CartJS by variant id
Bsify.get_cart_item_by_id = function (variant_id) {
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
Bsify.cart_has_variant = function (variant_id) {
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