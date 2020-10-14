const mongoose = require('mongoose');
const config = global.config;

const Profile = mongoose.model('Profile');

module.exports = async function (req, res, next) {
  let host = req.hostname;
  let clientDomain = config.clientDomain;

  let profile = await Profile.findOne({custom_domain: host}).exec();

  if (!profile || profile.visibility === "unpublished")
    return next();

  let user = profile.parent;
  let handle = profile.handle;

  let url = `${clientDomain}/u/${handle}`;

  if (user) {

    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
</head>

<body>
<iframe
  src='${url}'
  style="
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    border: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    z-index: 999999;
    height: 100%;
  ">
</iframe>
</body>
</html>`);

    return;
  }

  return next();
}
