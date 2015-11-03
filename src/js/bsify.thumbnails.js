require('uniformThumbnails');
require('jquery-orderly');

var Thumbnails = {};

Thumbnails.init = function () {
  var opts = {};
  if (Bsify.thumbnail_settings.constrain_images) {
    
    opts.fit = (Bsify.thumbnail_settings.crop_images)? 'crop' : 'scale';
    opts.align = Bsify.thumbnail_settings.image_alignment.toLowerCase();
    var ratio = Bsify.thumbnail_settings.image_ratio.toLowerCase();
    if (ratio === 'square' || ratio === 'landscape' || ratio === 'portrait') {
      opts.format = ratio;
    } else {
      opts.ratio = ratio;
    }
    
    var $img_wrappers = $(Bsify.thumbnail_selectors.image_wrapper);
    
    if ($img_wrappers.length > 0) {
      $img_wrappers.uniform_thumbnails(opts).on('ut_complete', function(){
        Thumbnails.orderly();
      });
    } else {
      // just use orderly
      Thumbnails.orderly();
    }
  } else {
    // just use orderly
    Thumbnails.orderly();
  }
  
  // Always unifrom thumbs on product thumbnails
  $('.product-image-thumbs li a').uniform_thumbnails(opts);
};

Thumbnails.orderly = function () {
  $(Bsify.thumbnail_selectors.details_wrapper).orderly({ method: 'children' });
};

module.exports = Thumbnails;