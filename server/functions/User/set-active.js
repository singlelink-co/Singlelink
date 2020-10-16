const mongoose = require('mongoose');

const User = mongoose.model('User');
const Profile = mongoose.model('Profile');

module.exports = async function (req, res) {
    if(!req.body.profile) return res.status(400).send('Missing profile');
    let pending_profile = await Profile.findOne({_id: req.body.profile});

    if(!pending_profile) return res.status(400).send('Could not find profile with provided ID');

    if(!pending_profile.parent.equals(req.user._id)) return res.status(400).send('User lacks permissions for provided profile');

    req.user.active_profile = pending_profile._id;

    await req.user.save();

    return res.send(pending_profile);
};
