// Collect the Bsify object from the window with our translations and liquid variables all set up
var Bsify = window.Bsify || {};

/*
var Bsify = function () {
  
};
*/

Bsify.hello = function () {
  return 'hello';
};

module.exports = Bsify;