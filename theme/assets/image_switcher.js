var Bsify = Bsify || {};

// NOTE: how will this all work with srcset ??!!

// Preload images for gallery
// Used the sized src
Bsify.preload_product_thumbs = function(){
  var $thumbs = $('[data-gallery-main]');
  var main_image_element = $($thumbs.data('gallery-main'))[0];
  var main_image_size = Shopify.Image.imageSize(main_image_element.src);
  
  if($thumbs.length > 0){
    $thumbs.each(function(){
      var image = new Image();
      var src = $(this).attr('href');
      var sized_src = Shopify.Image.getSizedImageUrl(src, main_image_size);
      image.src = sized_src;
    });
  }
};

// Initialise the image switcher for gallery thumbs
Bsify.image_swticher = function () {
  $(document).on('click', '[data-gallery-main]', function (e) {
    e.preventDefault();
    var $current_target = $(e.currentTarget);
    var main_image_element = $($current_target.data('gallery-main'))[0];
    var image_src = $current_target.attr('href');
    Bsify.switch_image(main_image_element, image_src);
  });
};

// Switch image
// - takes the main image element that will have it's src changed
// - and the new src to change it to
Bsify.switch_image = function (main_image_element, image_src) {
  if (!main_image_element || !image_src) {
    return;
  }
  // get the new image src at the correct size
  var main_image_size = Shopify.Image.imageSize(main_image_element.src);
  var new_image_src = Shopify.Image.getSizedImageUrl(image_src, main_image_size);
  // switch the main image to the new src
  if (main_image_element.src !== new_image_src) {
    main_image_element.src = new_image_src;
  }
};

if (Bsify.product !== undefined) {
  // Preload images and call image switcher init
  Bsify.preload_product_thumbs();
  Bsify.image_swticher();
}