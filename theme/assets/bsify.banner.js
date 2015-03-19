Banner = {};

var $banner = $('[data-banner]');
var try_counter = 0;

Banner.init = function () {
  if ($banner.length > 0) {
    Banner.start_carousel();
  }
};

Banner.start_carousel = function () {
  try {
    $banner.carousel();
  } catch (e) {
    Banner.try_again();
  }
};

Banner.try_again = function () {
  if (try_counter < 10) {
    try_counter++;
    setTimeout(function(){
      Banner.start_carousel();
    }, 10);
  }
};

module.exports = Banner;