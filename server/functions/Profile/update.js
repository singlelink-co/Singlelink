const mongoose = require('mongoose');

module.exports = (req, res) => {
  req.user.active_profile.image_url = req.body.image_url || null;
  if (req.body.headline) req.user.active_profile.headline = req.body.headline;
  if (req.body.subtitle) req.user.active_profile.subtitle = req.body.subtitle;
  if (req.body.handle) req.user.active_profile.handle = req.body.handle;
  if (req.body.visibility) req.user.active_profile.visibility = req.body.visibility;
  if (typeof req.body.custom_css != 'undefined') req.user.active_profile.custom_css = req.body.custom_css || '';
  if (typeof req.body.custom_html != 'undefined') req.user.active_profile.custom_html = req.body.custom_html || '';

  if (req.body.custom_domain) {
    req.user.active_profile.custom_domain = req.body.custom_domain;
  }

  req.user.active_profile.save((err, profile) => {
    if (err) return res.send(err);
    res.send(profile);
  })
}
