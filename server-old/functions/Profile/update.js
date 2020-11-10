const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = (req, res) => {
  if (typeof req.body.image_url != 'undefined') req.user.active_profile.image_url = req.body.image_url || null;
  if (req.body.headline) req.user.active_profile.headline = req.body.headline;
  if (req.body.subtitle) req.user.active_profile.subtitle = req.body.subtitle;
  if (req.body.handle) req.user.active_profile.handle = req.body.handle;
  if (req.body.visibility) req.user.active_profile.visibility = req.body.visibility;
  if (typeof req.body.custom_css != 'undefined') req.user.active_profile.custom_css = req.body.custom_css || '';
  if (typeof req.body.custom_html != 'undefined') req.user.active_profile.custom_html = req.body.custom_html || '';

  let userDomain;
  if (req.body.custom_domain) userDomain = new URL('https://' + req.body.custom_domain.replace('https://', '').replace('http://', ''));
  let apiDomain = new URL(config.apiDomain);

  if (req.body.custom_domain && userDomain.host !== apiDomain.host) {
    req.user.active_profile.custom_domain = userDomain.host;

    reverseProxy.register(userDomain.host, "127.0.0.1:4444");
  } else if ((typeof req.user.active_profile.custom_domain) !== undefined) {
    req.user.active_profile.custom_domain = null;
  }

  req.user.active_profile.save((err, profile) => {
    if (err) return res.send(err);
    res.send(profile);
  });
};
