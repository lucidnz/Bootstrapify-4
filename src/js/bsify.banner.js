Banner = {};

var $banner = $('[data-banner]');

Banner.init = function () {
  if ($banner.length > 0) {
    Banner.add_event_handlers();
  }
};

Banner.add_event_handlers = function () {
  // This event fires immediately when the slide instance method is invoked.
  $banner.on('slide.bs.carousel', function (e) {
    var $related_target = $(e.relatedTarget);
    // Set the data-banner attr to the current slides index so that we can do awesome scss stuffs
    $banner.attr('data-banner', $related_target.data('slide'));
  });
  
  // This event is fired when the carousel has completed its slide transition.
  $banner.on('slid.bs.carousel', function () {
  });
};
    
module.exports = Banner;