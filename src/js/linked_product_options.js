// (c) Copyright 2014 Caroline Schnapp. All Rights Reserved. Contact: mllegeorgesand@gmail.com
// See http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options

var Shopify = Shopify || {};

Shopify.optionsMap = {};

Shopify.updateOptionsInSelector = function(selectorIndex) {
  var key, selector;
    
  switch (selectorIndex) {
    case 0:
      key = 'root';
      selector = jQuery('.single-option-selector:eq(0)');
      break;
    case 1:
      key = jQuery('.single-option-selector:eq(0)').val();
      selector = jQuery('.single-option-selector:eq(1)');
      break;
    case 2:
      key = jQuery('.single-option-selector:eq(0)').val();  
      key += ' / ' + jQuery('.single-option-selector:eq(1)').val();
      selector = jQuery('.single-option-selector:eq(2)');
  }
  
  var initialValue = selector.val();
  selector.empty();    
  var availableOptions = Shopify.optionsMap[key];
  if (availableOptions !== undefined) {
    for (var i=0; i<availableOptions.length; i++) {
      var option = availableOptions[i];
      var newOption = jQuery('<option></option>').val(option).html(option);
      selector.append(newOption);
    }
    jQuery('.swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
      if (jQuery.inArray($(this).attr('data-value'), availableOptions) !== -1) {
        $(this).removeClass('soldout').show().find(':radio').removeAttr('disabled','disabled').removeAttr('checked');
      }
      else {
        $(this).addClass('soldout').hide().find(':radio').removeAttr('checked').attr('disabled','disabled');
      }
    });
    if (jQuery.inArray(initialValue, availableOptions) !== -1) {
      selector.val(initialValue);
    }
    selector.trigger('change');
  }
};

Shopify.linkOptionSelectors = function(product) {
  // Building our mapping object.
  for (var i=0; i<product.variants.length; i++) {
    var variant = product.variants[i];
    if (variant.available) {
      var key;
      // Gathering values for the 1st drop-down.
      Shopify.optionsMap.root = Shopify.optionsMap.root || [];
      Shopify.optionsMap.root.push(variant.option1);
      Shopify.optionsMap.root = Shopify.uniq(Shopify.optionsMap.root);
      // Gathering values for the 2nd drop-down.
      if (product.options.length > 1) {
        key = variant.option1;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option2);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      }
      // Gathering values for the 3rd drop-down.
      if (product.options.length === 3) {
        key = variant.option1 + ' / ' + variant.option2;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option3);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      }
    }
  }
  // Update options right away.
  Shopify.updateOptionsInSelector(0);
  if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
  if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
  // When there is an update in the first dropdown.
  jQuery(".single-option-selector:eq(0)").change(function() {
    Shopify.updateOptionsInSelector(1);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    return true;
  });
  // When there is an update in the second dropdown.
  jQuery(".single-option-selector:eq(1)").change(function() {
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    return true;
  });
  
};

// Lucid 03/2015
// Call linkOptionSelectors
// Check that we have a product and we even want to use the linked product options
if (Bsify.product && Bsify.linked_product_options) {
  // Make sure the product meets the correct citeria for linked product options and then initialise
  if (Bsify.product.available && Bsify.product.options.length > 1) {
    Shopify.linkOptionSelectors(Bsify.product);
  }
}