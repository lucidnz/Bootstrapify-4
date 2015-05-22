// When the element hits the top of the page make it stick to it
var PhdSticky = function () {
  var $ele = $('[data-phd="sticky"]');
  var $parent = $ele.parent();
  var parent_orig_margin_bottom = parseInt($parent.css('margin-bottom'));
  
  if ($ele.length > 0) {
    // bootstrap affix
    $ele.affix({
      offset: {
        top: $ele.offset().top,
        bottom: 30
      }
    }).on('affixed.bs.affix', function () {
      if ($ele.css('postition') !== 'relative') {
        $ele.parent().css({ 'margin-bottom': (parent_orig_margin_bottom + $ele.height()) });
      }
    }).on('affixed-top.bs.affix', function () {
      if ($ele.css('postition') !== 'relative') {
        $ele.parent().css({ 'margin-bottom': parent_orig_margin_bottom });
      }
    });
  }
};

module.exports = PhdSticky;