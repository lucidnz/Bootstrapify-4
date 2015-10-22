var Modal = {};
var modal_selector = '[data-bsify-modal]';
var modal_trigger_selector = '[data-modal-trigger]';
var $modal = $(modal_selector);
var $modal_trigger = $(modal_trigger_selector);

Modal.init = function () {
  console.log('Modal');
  if ($modal.length > 0) {
    $modal_trigger.each(function (i, trigger) {
      
    });
  }
};

module.exports = Modal;