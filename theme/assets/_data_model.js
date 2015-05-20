var DataModel = function (obj, properties) {
  this.obj = obj;
  this._build_properties(properties);
};

DataModel.prototype._build_properties = function (properties) {
  var _this = this;
  
  for (var key in properties) {
    if (properties.hasOwnProperty(key)) {
      _this._build_property_methods(key, properties[key]);
    }
  }
};

DataModel.prototype._build_property_methods = function (key, selector) {
  var selector_key = key+'_selector';
  Object.defineProperty(this.obj, selector_key, {
    value: selector
  });
  
  var value;
  var _this = this;
  Object.defineProperty(this.obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      return value;
    },
    set: function (new_value) {
      if (value !== new_value) {
        value = new_value;
        _this._update_elements(selector, value);
      }
    }
  });
};

DataModel.prototype._update_elements = function (selector, value) {
  var _this = this;
  $(selector).each(function (i, element) {
    _this._set_element_value(element, value);
  });
};

DataModel.prototype._set_element_value = function (element, value) {
  var $element = $(element);
  if (this._is_input(element)) {
    $element.val(value);
  } else {
    $element.html(value);
  }
};

DataModel.prototype._is_input = function (element) {
  var tag_name = element.tagName.toLowerCase();
  return tag_name === 'input' || tag_name === 'select' || tag_name === 'textarea';
};

module.exports = DataModel;