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
    // Timeout hack to make sure the transitions have finished.
    setTimeout(function () {
      if ($(menu_selector+' .collapse.in').length === 0) {
        $menu.removeClass('open');
      }
    }, 350);
  });
};

module.exports = MegaMenu;