var DataModel = require('./_data_model.js');

var StandardCartDisplayItem = function (items_wrapper_selector, item_selector, item_id) {
  this.id = item_id;
  this.item_selector = item_selector.replace(']', '="'+this.id+'"]');
  this.items_wrapper_selector = items_wrapper_selector;
  this.selector = this.items_wrapper_selector+' '+this.item_selector;
  
  this.$ele = $(this.item_selector);
  
  this.price_tempate = this.$ele.find('.phd-side-cart-item-price-template').html();
  
  new DataModel(this, {
    title: this.selector+' [data-phd-side-cart-item-title]',
    quantity: this.selector+' [data-phd-side-cart-item-qty]',
    price: this.selector+' [data-phd-side-cart-item-price]',
    line_price: this.selector+' [data-phd-side-cart-item-line-price]'
  });
};

StandardCartDisplayItem.prototype.update = function (item) {
  this.quantity = item.quantity;
  this.price = this._price_markup(item.price);
  this.line_price = this._price_markup(item.line_price);
  if (this.title === undefined) {
    this.title = item.title;
  }
};

// Private

StandardCartDisplayItem.prototype._price_markup = function (item_price) {
  var item_price_formated = Shopify.formatMoney(item_price, Bsify.money_formats.moneyFormat);
  var item_price_with_currency_formated = Shopify.formatMoney(item_price, Bsify.money_formats.moneyWithCurrencyFormat);
  return this.price_tempate
    .replace('[ITEM_PRICE_DATA]', item_price)
    .replace('[ITEM_PRICE]', item_price_formated)
    .replace('[ITEM_PRICE_WITH_CURRENCY]', item_price_with_currency_formated);
};

module.exports = StandardCartDisplayItem;