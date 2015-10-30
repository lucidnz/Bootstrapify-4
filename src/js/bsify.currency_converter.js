var Cookies = require('./_cookies.js');
var CurrencyConverter = {};

CurrencyConverter.init = function () {
  if (Bsify.currency_converter_options.enabled) {
    console.log('CurrencyConverter', Bsify.currency_converter_options);
  }
};

module.exports = CurrencyConverter;