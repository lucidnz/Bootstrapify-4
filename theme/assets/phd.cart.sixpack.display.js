var SixPackDisplay = function ($ele) {
  this.$ele = $ele;
};

SixPackDisplay.prototype.add_to_holding = function (product) {
  console.log('add_to_holding', product);
};

module.exports = SixPackDisplay;