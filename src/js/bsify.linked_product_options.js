// (c) Copyright 2014 Caroline Schnapp. All Rights Reserved. Contact: mllegeorgesand@gmail.com
// See http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options
// Modified for use with Bootstrapify4 by Lucid - 03/2015

var LinkedProductOptions = {};
LinkedProductOptions.optionsMap = {};

LinkedProductOptions.updateOptionsInSelector = function(selectorIndex) {
  var key, selector;
    
  switch (selectorIndex) {
    case 0:
      key = 'root';
      selector = $('.single-option-selector:eq(0)');
      break;
    case 1:
      key = $('.single-option-selector:eq(0)').val();
      selector = $('.single-option-selector:eq(1)');
      break;
    case 2:
      key = $('.single-option-selector:eq(0)').val();  
      key += ' / ' + $('.single-option-selector:eq(1)').val();
      selector = $('.single-option-selector:eq(2)');
  }
  
  var initialValue = selector.val();
  selector.empty();    
  var availableOptions = LinkedProductOptions.optionsMap[key];
  if (availableOptions !== undefined) {
    for (var i=0; i<availableOptions.length; i++) {
      var option = availableOptions[i];
      var newOption = $('<option></option>').val(option).html(option);
      selector.append(newOption);
    }
    $('.swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
      if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
        $(this).removeClass('soldout').show().find(':radio').removeAttr('disabled','disabled').removeAttr('checked');
      }
      else {
        $(this).addClass('soldout').hide().find(':radio').removeAttr('checked').attr('disabled','disabled');
      }
    });
    if ($.inArray(initialValue, availableOptions) !== -1) {
      selector.val(initialValue);
    }
    selector.trigger('change');
  }
};

LinkedProductOptions.linkOptionSelectors = function(product) {
  // Building our mapping object.
  for (var i=0; i<product.variants.length; i++) {
    var variant = product.variants[i];
    if (variant.available) {
      var key;
      // Gathering values for the 1st drop-down.
      LinkedProductOptions.optionsMap.root = LinkedProductOptions.optionsMap.root || [];
      LinkedProductOptions.optionsMap.root.push(variant.option1);
      LinkedProductOptions.optionsMap.root = Shopify.uniq(LinkedProductOptions.optionsMap.root);
      // Gathering values for the 2nd drop-down.
      if (product.options.length > 1) {
        key = variant.option1;
        LinkedProductOptions.optionsMap[key] = LinkedProductOptions.optionsMap[key] || [];
        LinkedProductOptions.optionsMap[key].push(variant.option2);
        LinkedProductOptions.optionsMap[key] = Shopify.uniq(LinkedProductOptions.optionsMap[key]);
      }
      // Gathering values for the 3rd drop-down.
      if (product.options.length === 3) {
        key = variant.option1 + ' / ' + variant.option2;
        LinkedProductOptions.optionsMap[key] = LinkedProductOptions.optionsMap[key] || [];
        LinkedProductOptions.optionsMap[key].push(variant.option3);
        LinkedProductOptions.optionsMap[key] = Shopify.uniq(LinkedProductOptions.optionsMap[key]);
      }
    }
  }
  // Update options right away.
  LinkedProductOptions.updateOptionsInSelector(0);
  if (product.options.length > 1) LinkedProductOptions.updateOptionsInSelector(1);
  if (product.options.length === 3) LinkedProductOptions.updateOptionsInSelector(2);
  // When there is an update in the first dropdown.
  $(document).on('change', '.single-option-selector:eq(0)', function() {
    LinkedProductOptions.updateOptionsInSelector(1);
    if (product.options.length === 3) LinkedProductOptions.updateOptionsInSelector(2);
    return true;
  });
  // When there is an update in the second dropdown.
  $(document).on('change', '.single-option-selector:eq(1)', function() {
    if (product.options.length === 3) LinkedProductOptions.updateOptionsInSelector(2);
    return true;
  });
};

module.exports = LinkedProductOptions;