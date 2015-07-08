var PasswordRecover = function () {
  this.recover_string = '#recover';
  this.$links = $('main [href*="/account/login"]');
  this.$sections = $('[data-bsify-toggle-recover]');
  this.force = ($('[data-bsify-toggle-recover-force]').length > 0);
  
  if (this.$sections.length > 0) {
    this._add_event_listeners();
    this.toggle_forms();
  }
};

PasswordRecover.prototype.toggle_forms = function () {
  if (window.location.hash === this.recover_string || this.force) {
    this.show_recover_form();
  } else {
    this.show_login_form();
  }
};

PasswordRecover.prototype.show_recover_form = function () {
  var _this = this;
  this._each_section(function ($section) {
    _this._toggle_section(($section.data('bsify-toggle-recover') === 'recover'), $section);
  });
};

PasswordRecover.prototype.show_login_form = function () {
  var _this = this;
  this._each_section(function ($section) {
    _this._toggle_section(($section.data('bsify-toggle-recover') !== 'recover'), $section);
  });
};

// Private

PasswordRecover.prototype._add_event_listeners = function () {
  var _this = this;
  _this.$links.on('click', function (e) {
    e.preventDefault();
    _this._on_click($(e.currentTarget));
  });
};

PasswordRecover.prototype._on_click = function ($current_target) {
  if ($current_target.attr('href').indexOf(this.recover_string) > -1) {
    this.show_recover_form();
  } else {
    this.show_login_form();
  }
};

PasswordRecover.prototype._each_section = function (callback) {
  this.$sections.each(function (i, section) {
    var $section = $(section);
    callback($section);
  });
};

PasswordRecover.prototype._toggle_section = function (condition, $section) {
  if (condition) {
    $section.show();
  } else {
    $section.hide();
  }
};

module.exports = PasswordRecover;