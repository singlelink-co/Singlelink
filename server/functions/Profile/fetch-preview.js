const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');
const Link = mongoose.model('Link');
const User = mongoose.model('User');
const Theme = mongoose.model('Theme');

module.exports = async (req, res) => {
  const payload = {
    profile: req.user.active_profile,
    profiles: await Profile.find({parent: req.user._id}),
    links: null,
    user: req.user,
    theme: null
  };
  Link.find({
        parent: req.user.active_profile._id
    }, async (err, links) => {
        if(payload.profile.theme) payload.theme = await Theme.findOne({_id: payload.profile.theme || ''});
        if(err) return res.send(err);
        payload.links = links || [];
        res.send(payload);
    });
}
