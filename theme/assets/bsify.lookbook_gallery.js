var imgl    = require('imagesloaded');
var mq      = require('./bsify.media_queries.js');
require('./bsify.touch.js');

/* Loader */
var GalleryLoader = function (ele, parent_ele) {
  this.ele = ele;
  this.parent_ele = parent_ele;
  this.onLoaded = function(){};
};

GalleryLoader.prototype.init = function(){
  this.$ele = $(this.ele);
  this.$fallbackImg = this.$ele.find('.fallback-image');
  this.carousel_width = 0;
  this.imgLoad = new imgl(this.ele);
  this.lastMQ = mq.size();
  
  var _this = this;
  this.imgLoad.on('progress', function(instance, image){
    _this._collect_image_width(image);
  }).on('done', function(){
    _this._set_carousel_width();
    _this.onLoaded.apply(_this);
  });
  
  $(window).on('resize', function () {
    if (_this.lastMQ !== mq.size()) {
      _this.carousel_width = 0;
      _this._recalculate_carousel_width();
      _this.lastMQ = mq.size();
    }
  });
};

// Private
GalleryLoader.prototype._collect_image_width = function(image){
  if(image.isLoaded){
    var $img = $(image.img);
    var $parent = $img.closest(this.parent_ele);
    this.carousel_width += this._image_parents_width($parent);
  } else {
    $(image.img).hide();
  }
};

GalleryLoader.prototype._collect_fallback_image_width = function(){
  if (this.$fallbackImg.length > 0) {
    var _this = this;
    _this.$fallbackImg.each(function (i,ele) {
      var $ele = $(ele);
      var $parent = $ele.closest(_this.parent_ele);
      _this.carousel_width += _this._image_parents_width($parent);
    });
  }
};

GalleryLoader.prototype._recalculate_carousel_width = function(){
  var _this = this;
  _this.$ele.find('img').each(function (i, img) {
    var image = {
      img: img,
      isLoaded: true
    };
    _this._collect_image_width(image);
  });
  _this._set_carousel_width();
};

GalleryLoader.prototype._image_parents_width = function($image_parent){
  // plus one becuase js is rounding actual width where as browser is not
  return $image_parent.width() + this._padding_to_num($image_parent, 'paddingLeft') + this._padding_to_num($image_parent, 'paddingRight') + 1;
};

GalleryLoader.prototype._padding_to_num = function($image_parent, padding){
  return parseInt($image_parent.css(padding).replace('px', ''));
};

GalleryLoader.prototype._set_carousel_width = function(){
  this._collect_fallback_image_width();
  this.$ele.width(this.carousel_width);
};

/* Main */
var Gallery = function(options){
  this.options = options;
  
  this.ele = this.options.gallery_wrapper;
  this.item_wrapper = this.options.item_wrapper;
  this.controls_wrapper = this.options.controls_wrapper;
  this.loader = new GalleryLoader(this.ele, this.options.item_wrapper);
  this.on_loaded = false;
  
  this._init();
};

Gallery.prototype.update = function () {
  this.$ele.parent().animate({opacity: 0}, 'slow');
  this._remove_event_handlers();
  this._init();
};

Gallery.prototype._init = function(){
  this.$ele = $(this.ele);

  if(this.$ele.length > 0){
    this._add_event_handlers();
    this.loader.init();
    this._set_current_image();
  }
};

Gallery.prototype._add_event_handlers = function(){
  var _this = this;
  this.loader.onLoaded = function(){
    _this.$ele.parent().animate({opacity: 1}, 'slow');
    if (_this.on_loaded) _this.on_loaded.apply(_this);
  };
  
  $(document).on('swipeLeft', this.controls_wrapper, function (e) {
    _this._next_img();
  });
  
  $(document).on('swipeRight', this.controls_wrapper, function (e) {
    _this._prev_img();
  });
  
  $(document).on('click', '[data-gallery-direction]', function (event) {
    event.preventDefault();
    var $current_target = $(event.currentTarget);
    if ($current_target.data('gallery-direction') === 'left') {
      _this._prev_img();
    } else {
      _this._next_img();
    }
  });
};

Gallery.prototype._remove_event_handlers = function(){
  this.loader.onLoaded = false;
  
  $(document).off('swipeLeft', this.controls_wrapper);
  $(document).off('swipeRight', this.controls_wrapper);
  $(document).off('click', '[data-gallery-direction]');
};

Gallery.prototype._set_current_image = function(){
  var $current = this.$ele.find(this.item_wrapper+'.is_current');
  if ($current.length > 0) {
   this.$current_image = $current.first();
  } else {
   this.$current_image = this.$ele.find(this.item_wrapper).first();
  }
  this.$current_image.addClass('is_current');
  this._check_for_end();
};

Gallery.prototype._prev_img = function(){
  var prev = this.$current_image.prev();
  if (prev.length > 0) {
    prev.css({ marginLeft: '0' }).addClass('is_current');
    this.$current_image.removeClass('is_current');
    this.$current_image = prev;
    this._check_for_end();
  }
};

Gallery.prototype._next_img = function(){
  var next = this.$current_image.next();
  if (next.length > 0) {
    var width = this.loader._image_parents_width(this.$current_image);
    this.$current_image.css({ marginLeft: (width * -1) }).removeClass('is_current');
    next.addClass('is_current');
    this.$current_image = next;
    this._check_for_end();
  }
};

Gallery.prototype._check_for_end = function () {
  $('[data-gallery-direction]').removeClass('disabled');
  if (this.$current_image.prev().length === 0) {
    $('[data-gallery-direction="left"]').addClass('disabled');
  } else if (this.$current_image.next().length === 0) {
    $('[data-gallery-direction="right"]').addClass('disabled');
  }
};

module.exports = Gallery;