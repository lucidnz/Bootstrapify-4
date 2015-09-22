var MegaMenu = {};
var menu_selector = '[data-menu="mega"]';

MegaMenu.init = function () {
  if ($(menu_selector).length > 0) {
    MegaMenu.add_event_handlers();
  }
};

MegaMenu.add_event_handlers = function () {
  // Hide all open menus
  $(document).on('show.bs.collapse', menu_selector+' .collapse', function () {
    $(menu_selector+' .collapse.in').each(function (i, item) {
      $(item).collapse('hide');
    });
  });
};

module.exports = MegaMenu;