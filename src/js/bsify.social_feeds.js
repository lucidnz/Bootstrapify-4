var Instagram = require('./bsify.social_feed_instagram.js');

var SocialFeeds = {};

SocialFeeds.init = function () {
  SocialFeeds.instagram();
};

SocialFeeds.instagram = function () {
  var eles = SocialFeeds._get_elements('instagram');
  if (eles.length > 0) {
    eles.each(function () {
      new Instagram(this);
    });
  }
};

SocialFeeds._get_elements = function (service) {
  var ele_selector = '[data-social-feed="'+service+'"]';
  return $(ele_selector);
};

module.exports = SocialFeeds;