var DataModel = function (id, properties) {
  // abstracts a thing
  // binds to an element for rendering
  // has events?
  
  this.id = id;
  this._build_properties(properties);
};

DataModel.prototype._build_properties = function (properties) {
  var _this = this;
  
  for (var key in properties) {
    if (properties.hasOwnProperty(key)) {
      _this._build_property_methods(key, properties);
    }
  }
};

DataModel.prototype._build_property_methods = function (key, properties) {
  var value = properties[key];
  Object.defineProperty(this, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      return value;
    },
    set: function (new_value) {
      if (value !== new_value) {
        value = new_value;
      }
    }
  });
};

module.exports = DataModel;