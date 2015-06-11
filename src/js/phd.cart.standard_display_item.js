var DataModel = require('./_data_model.js');

var StandardCartDisplayItem = function (items_wrapper_selector, item_selector, item_id) {
  this.id = item_id;
  this.item_selector = item_selector.replace(']', '="'+this.id+'"]');
  this.items_wrapper_selector = items_wrapper_selector;
  this.selector = this.items_wrapper_selector+' '+this.item_selector;
  
  new DataModel(this, {
    title: this.selector+' [data-phd-side-cart-item-title]',
    quantity: this.selector+' [data-phd-side-cart-item-qty]'
  });
};

StandardCartDisplayItem.prototype.update = function (item) {
  this.quantity = item.quantity;
  if (this.title === undefined) {
    this.title = item.title;
  }
};

// Private

module.exports = StandardCartDisplayItem;