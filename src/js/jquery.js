// If we already have jquery set in the global scope then use that otherwise require jquery.
// We do this so that we can load a 1.x version for legacy browsers while still using the most up to date versions for new browsers
var $ = window.$ || require('jquery');

// expose jQuery to the global scope
window.$ = $;
window.jQuery = $;

module.exports = $;