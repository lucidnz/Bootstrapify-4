// When the element hits the top of the page make it stick to it
var PhdSticky = function () {
  var $ele = $('[data-phd="sticky"]');
  
  if ($ele.length > 0) {
    // bootstrap affix
    $ele.affix({
      offset: {
        top: $ele.offset().top,
        bottom: 30
      }
    });
  }
};

module.exports = PhdSticky;