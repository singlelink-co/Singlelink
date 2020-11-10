const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');

module.exports = async (req, res) => {
    if(!req.user.active_profile) return res.status(400).send('Active profile required');
    const user_profiles = await Profile.find({parent: req.user._id});
    if(user_profiles.length <= 1) return res.status(400).send('You need to make another profile before deleting this one');
    await Profile.deleteOne({_id: req.user.active_profile});
    const remaining_profiles = await Profile.find({parent: req.user._id});
    req.user.active_profile = remaining_profiles[0];
    await req.user.save();
    return res.send(remaining_profiles[0]);
};
