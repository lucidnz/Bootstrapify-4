/*
  Main app for Bootstrapify
*/

$ = require('./jquery.js');
Bsify = require('./bsify.js');
CartJS = require('shopify-cartjs');

var App = function () {
  
  console.log('Bsify', Bsify, Bsify.hello());
  console.log('CartJS', CartJS);
  console.log('Shopify', Shopify);
};

// initiate the app and expose it to the browser
var app = new App();
module.exports = app;