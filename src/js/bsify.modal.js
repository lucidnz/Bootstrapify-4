/*
  TODO:
  - handle multiple modals
*/

var Modal = {};
var modal_selector = '[data-bsify-modal]';
var modal_trigger_selector = '[data-modal-trigger]';
var $modal = $(modal_selector);
var $modal_trigger = $(modal_trigger_selector);

Modal.init = function () {
  if ($modal.length > 0) {
    $modal_trigger.each(function (i, trigger) {
      Modal._set_trigger_listener(trigger);
    });
  }
  
  Modal._set_event_listeners();
};

// Private

Modal._set_event_listeners = function () {
  // clean up content
  $modal.on('hidden.bs.modal', function (e) {
    $modal.find('.modal-content').html('');
  });
};

Modal._set_trigger_listener = function (trigger) {
  var $trigger = $(trigger);
  $trigger.on('click', function (e) {
    e.preventDefault();
    var $current_target = $(e.currentTarget);
    var content_url = $current_target.attr('href');
    $modal.modal();
    $.ajax(content_url).done(function (data) {
      $modal.find('.modal-content').html(data);
    });
  });
};

module.exports = Modal;