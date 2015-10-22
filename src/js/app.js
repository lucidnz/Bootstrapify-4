/*
  Main app for Bootstrapify
*/

var Bsify = require('./bsify.js');
var CartJS = require('shopify-cartjs');
var Lookbook = require('./bsify.lookbook_gallery.js');

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

  // load uniform thumbs and orderly
  Bsify.Thumbnails.init();

  // init event listeners for banner
  Bsify.Banner.init();
  Bsify.BannerVideo.init();

  // init event listeners for megamenu 
  Bsify.MegaMenu.init();

  // init event listeners for scroll_to 
  Bsify.ScrollTo.init();

  // init event listeners for modals 
  Bsify.Modal.init();

  // init lookbook gallery
  if ($('.collection-lookbook').length > 0) {
    var lookbook = new Lookbook({
      gallery_wrapper: '.collection-lookbook .products.group',
      item_wrapper: '.group-item-wrap',
      controls_wrapper: '.lookbook-controls'
    });

    lookbook.on_loaded = function () {
      Bsify.Thumbnails.orderly();
    };
  }

  // test for placeholder
  if (Modernizr.input.placeholder) {
    $('html').addClass('placeholder');
  } else {
    $('html').addClass('no-placeholder');
  }

  // init social feeds
  Bsify.SocialFeeds.init();
  
  new Bsify.PasswordRecover();
};

// initiate the app and expose it to the browser
var app = new App();
module.exports = app;
window.CartJS = CartJS;