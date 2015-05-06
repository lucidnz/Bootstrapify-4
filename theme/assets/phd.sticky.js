var PhdSticky = function () {
  var target_ele = '[data-phd="sticky"]';
  var $ele = $(target_ele);
  
  $ele.affix({
    offset: {
      top: 333,
      bottom: 100
    }
  });
};

module.exports = PhdSticky;