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
    Modal._load_content($current_target);
  });
};

Modal._load_content = function ($current_target) {
  var content_url = $current_target.attr('href');
  if (Modal._is_external_content(content_url)) {
    $.ajax(content_url).done(function (content) {
      $modal.find('.modal-content').html(content);
    });
  } else {
    var content = $(content_url).html();
    $modal.find('.modal-content').html(content);
  }
  $modal.modal();
};

Modal._is_external_content = function (content_url) {
  return content_url.charAt(0) !== '#';
};

module.exports = Modal;