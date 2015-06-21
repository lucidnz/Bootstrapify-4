// When the element hits the top of the page make it stick to it
var PhdSticky = function () {
  this.$ele = $('[data-phd="sticky"]');
  this.$parent = this.$ele.parent();
  this.parent_orig_margin_bottom = this.css_to_int(this.$parent, 'margin-bottom');
  
  var _this = this;
  if (_this.$ele.length > 0) {
    // bootstrap affix
    _this.$ele.affix({
      offset: {
        top: _this.$ele.offset().top,
        bottom: 30
      },
      target: '.offcanvas-main'
    }).on('affixed.bs.affix', function () {
      var margin = (_this.$ele.css('position') !== 'relative') ? (_this.parent_orig_margin_bottom + _this.ele_height()) : _this.parent_orig_margin_bottom;
      _this.set_margin(margin);
    }).on('affixed-top.bs.affix', function () {
      _this.set_margin(_this.parent_orig_margin_bottom);
    });
  }
};

PhdSticky.prototype.set_margin = function (margin) {
  this.$parent.css({ 'margin-bottom': margin });
};

PhdSticky.prototype.ele_height = function (margin) {
  return this.$ele.height() + this.css_to_int(this.$ele, 'margin-top') + this.css_to_int(this.$ele, 'margin-bottom') + this.css_to_int(this.$ele, 'padding-top') + this.css_to_int(this.$ele, 'padding-bottom');
};

PhdSticky.prototype.css_to_int = function ($ele, prop) {
  return parseInt($ele.css(prop));
};

module.exports = PhdSticky;