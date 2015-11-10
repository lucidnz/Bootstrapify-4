var ScrollTo = {};
var scroll_selector = '[data-scroll-to]';

ScrollTo.init = function () {
  $(document).on('click', scroll_selector, function (e) {
    e.preventDefault();
    var target = $(this).attr('href');
    ScrollTo.go(target);
  });
};

ScrollTo.go = function (target) {
  $('body,html').animate({
    scrollTop: $(target).offset().top
  }, 800);
};

module.exports = ScrollTo;