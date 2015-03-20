/*
  Main app for Bootstrapify
*/

Bsify = require('./bsify.js');
CartJS = require('shopify-cartjs');

var App = function () {
  // init CartJS
  CartJS.init(Bsify.cart, Bsify.money_formats);
  
  // init product template js
  if (Bsify.product) {
    // Preload images and call image switcher init
    Bsify.ImageSwitcher.preload_product_thumbs();
    Bsify.ImageSwitcher.image_swticher();
    // Initialise the image_variant_switcher
    Bsify.VariantOptionSwitcher.image_variant_switcher();
    
    // Call linkOptionSelectors
    // Check that we want to use the linked product options
    if (Bsify.linked_product_options) {
      // Make sure the product meets the correct citeria for linked product options and then initialise
      if (Bsify.product.available && Bsify.product.options.length > 1) {
        Bsify.LinkedProductOptions.linkOptionSelectors(Bsify.product);
      }
    }
  }
  
  // init ajax add to cart
  if (Bsify.ajax_add_to_cart) {
    Bsify.Cart.init();
  }
  
  // init event listeners for banner
  Bsify.Banner.init();
  
};

// initiate the app and expose it to the browser
var app = new App();
module.exports = app;