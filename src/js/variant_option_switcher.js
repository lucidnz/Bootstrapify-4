// Make the original variant selector update the generated option selectors
// we are not doing this on a trigger event because if we did we'd end up in recursive hell
Bsify.update_product_selector_options = function ($product_selector) {
  if ($product_selector === undefined) {
    $product_selector = $(document.getElementById(Bsify.product_selector_id));
  }
  
  // get the selected variant object
  var variant_id = parseInt($product_selector.val());
  var variant = Bsify.get_variant_by_id(variant_id);
  
  // update each option selector
  for (var i = 0; i < Bsify.product.options.length; i++) {
    var option = 'option'+(i+1);
    var value = variant[option];
    $('.single-option-selector:eq('+i+')').val(value).trigger('change');
  }
};

Bsify.get_variant_by_id = function (variant_id) {
  var selected_variant = false;
  for (var i = 0; i < Bsify.product.variants.length; i++) {
    var variant = Bsify.product.variants[i];
    if (variant.id === variant_id) {
      selected_variant = variant;
    }
  }
  return selected_variant;
};

// Switch the variant if the gallery thumb is linked to one
Bsify.image_variant_switcher = function () {
  var $product_selector = $(document.getElementById(Bsify.product_selector_id));
  $(document).on('click', '[data-variant-id]', function (e) {
    e.preventDefault();
    var $current_target = $(e.currentTarget);
    // update the product selector with the new variant id
    $product_selector.val($current_target.data('variant-id'));
    // update the option selectors
    Bsify.update_product_selector_options($product_selector);
  });
};

if (Bsify.product !== undefined && Bsify.product_selector_id !== undefined) {
  // Initialise the image_variant_switcher
  Bsify.image_variant_switcher();
}