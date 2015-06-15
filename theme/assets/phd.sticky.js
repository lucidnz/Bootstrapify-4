// When the element hits the top of the page make it stick to it
var PhdSticky = function () {
  var $ele = $('[data-phd="sticky"]');
  var $parent = $ele.parent();
  var $window = $(window);
  var parent_orig_margin_bottom = parseInt($parent.css('margin-bottom'));
  
  var set_margin = function (margin) {
    $ele.parent().css({ 'margin-bottom': margin });
  };
  
  if ($ele.length > 0) {
    
    console.log('Make sticky');
    
    // bootstrap affix
    $ele.affix({
      offset: {
        top: $ele.offset().top,
        bottom: 30
      }
    }).on('affixed.bs.affix', function () {
      var margin = ($ele.css('position') !== 'relative') ? (parent_orig_margin_bottom + $ele.height()) : parent_orig_margin_bottom;
      set_margin(margin);
    }).on('affixed-top.bs.affix', function () {
      set_margin(parent_orig_margin_bottom);
    });
  }
};

module.exports = PhdSticky;