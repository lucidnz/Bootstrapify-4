var Cookies = require('./_cookies.js');
var CurrencyConverter = {};

var currency_switcher_selector = '[data-currency-code]';
var currency_current_selector = '[data-currency-current]';

CurrencyConverter.init = function () {
  if (Bsify.currency_converter_options.enabled) {
    
    // check for currency cookie. If we don't have one set it to be the stores currency
    if (!Cookies.hasItem('current_currency')) {
      Cookies.setItem('current_currency', Bsify.currency_converter_options.store_currency);
    }
    
    // add listener for conveter
    $(document).on('click', currency_switcher_selector, function (e) {
      e.preventDefault();
      CurrencyConverter.convert();
    });
    
    // convert the currency
    CurrencyConverter.convert();
    
    console.log('CurrencyConverter', Bsify.currency_converter_options, Cookies.getItem('current_currency'));
  }
};

CurrencyConverter.convert = function () {
  console.log('CurrencyConverter SWITCH', Cookies.getItem('current_currency'));
};

module.exports = CurrencyConverter;