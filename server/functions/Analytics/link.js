import {DeepLinker} from "nc-deeplink";

const mongoose = require('mongoose');
const Link = mongoose.model('Link');
const Visit = mongoose.model('Visit');

module.exports = async (req, res) => {
  let link, visit;
  try {
    link = await Link.findOne({_id: req.params._id});
    visit = new Visit({
      type: 'Link',
      referral: req.params._id
    });
    await visit.save();
  } catch (err) {
    return res.send(err.message);
  }

  if (link.useDeepLink) {
    const userAgent = req.get('user-agent');
    const deepLink = DeepLinker.parseDeepLink(link.url, userAgent);

    return res.redirect(deepLink);
  } else {
    return res.redirect(link.url);
  }

}
