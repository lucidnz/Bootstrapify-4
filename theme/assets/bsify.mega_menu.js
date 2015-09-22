var MegaMenu = {};
var menu_selector = '[data-menu="mega"]';
var $menu = $(menu_selector);

MegaMenu.init = function () {
  if ($menu.length > 0) {
    MegaMenu.add_event_handlers();
  }
};

MegaMenu.add_event_handlers = function () {
  // Hide all open menus
  $(document).on('show.bs.collapse', menu_selector+' .collapse', function () {
    $(menu_selector+' .collapse.in').each(function (i, item) {
      $(item).collapse('hide');
    });
    $menu.addClass('open');
  });
  
  $(document).on('hidden.bs.collapse', menu_selector+' .collapse', function () {
    console.log('MM:', $(menu_selector+' .collapse.in').length);
    
    if ($(menu_selector+' .collapse.in').length === 1) {
      $menu.removeClass('open');
    }
  });
};

module.exports = MegaMenu;