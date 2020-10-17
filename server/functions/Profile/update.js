const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = (req, res) => {
  req.user.active_profile.image_url = req.body.image_url || null;
  if (req.body.headline) req.user.active_profile.headline = req.body.headline;
  if (req.body.subtitle) req.user.active_profile.subtitle = req.body.subtitle;
  if (req.body.handle) req.user.active_profile.handle = req.body.handle;
  if (req.body.visibility) req.user.active_profile.visibility = req.body.visibility;
  if (typeof req.body.custom_css != 'undefined') req.user.active_profile.custom_css = req.body.custom_css || '';
  if (typeof req.body.custom_html != 'undefined') req.user.active_profile.custom_html = req.body.custom_html || '';

  let userDomain = new URL(req.body.custom_domain);
  let apiDomain = new URL(config.apiDomain);

  if (userDomain.host !== apiDomain.host) {
    if (req.body.custom_domain) {
      req.user.active_profile.custom_domain = userDomain.host;

      if (environment === 'development') {
        proxy.register(userDomain.host, "127.0.0.1:4444");
      } else {
        proxy.register(userDomain.host, "127.0.0.1:4444", {
          ssl: {
            letsencrypt: {
              email: 'letsencrypt@neutroncreative.com', // Domain owner/admin email
              production: config.production, // WARNING: Only use this flag when the proxy is verified to work correctly to avoid being banned!
            }
          }
        });
      }
    } else if ((typeof req.user.active_profile.custom_domain) !== undefined) {
      req.user.active_profile.custom_domain = null;
    }
  }

  req.user.active_profile.save((err, profile) => {
    if (err) return res.send(err);
    res.send(profile);
  });
};
