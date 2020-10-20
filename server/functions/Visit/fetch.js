const mongoose = require('mongoose');

const Visit = mongoose.model('Visit');
const Link = mongoose.model('Link');

module.exports = async (req, res) => {
  // Fetch items from database

  // If free, set max-expiration for data to 30 days
  // This will be updated in the future.
  let days = 30;

  /*let timestamp_test = await Visit.findOne();
  res.send(timestamp_test.created_on);*/

  let profile_views = await Visit.find({
    type: 'Page',
    referral: req.user.active_profile._id,
  });

  let profile_view_sum = 0;

  for (let i = 0; i < profile_views.length; i++) {
    if (new Date(profile_views[i].created_on) > new Date((new Date().getTime() - (days * 24 * 60 * 60 * 1000)))) {
      profile_view_sum++;
    }
  }

  let links = await Link.find({
    parent: req.user.active_profile._id
  });

  let link_views = [];
  let total_link_sum = 0;

  for (let i = 0; i < links.length; i++) {
    let temp_link_views = await Visit.find({
      type: 'Link',
      referral: links[i]._id,
    });

    let temp_link_sum = 0;
    total_link_sum++;

    for (let i = 0; i < temp_link_views.length; i++) {
      if (new Date(temp_link_views[i].created_on) > new Date((new Date().getTime() - (days * 24 * 60 * 60 * 1000)))) {
        temp_link_sum++;
      }
    }

    link_views.push({
      link: links[i],
      views: temp_link_sum
    });
  }

  let ctr = total_link_sum/profile_view_sum*100;

  // Return payload
  return res.send({
    profile_view_sum,
    link_views,
    ctr
  });
};
