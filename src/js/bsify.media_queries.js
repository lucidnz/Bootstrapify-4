require('./_polyfills.js').getComputedStyle();

module.exports.size = function () {
  return window.getComputedStyle(document.body,':after').getPropertyValue('content').replace(/['"]/g, "");
};