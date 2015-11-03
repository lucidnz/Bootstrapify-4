// Collect the Bsify object from the window with our translations and liquid variables all set up
var Bsify = window.Bsify || {};

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

// add bsify classes to the Bsify object
Bsify.Cart = require('./bsify.cart.js');
Bsify.ImageSwitcher = require('./bsify.image_switcher.js');
Bsify.VariantOptionSwitcher = require('./bsify.variant_option_switcher.js');
Bsify.LinkedProductOptions = require('./bsify.linked_product_options.js');
Bsify.Banner = require('./bsify.banner.js');
Bsify.BannerVideo = require('./bsify.banner_video.js');
Bsify.Thumbnails = require('./bsify.thumbnails.js');
Bsify.SocialFeeds = require('./bsify.social_feeds.js');
Bsify.PasswordRecover = require('./bsify.password_recover.js');
Bsify.MegaMenu = require('./bsify.mega_menu.js');
Bsify.ScrollTo = require('./bsify.scroll_to.js');
Bsify.Modal = require('./bsify.modal.js');

module.exports = Bsify;