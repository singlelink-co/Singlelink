const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');

module.exports = (req, res) => {
    Profile.find({parent:req.user._id})
        .exec((err, profiles) => {
            if(err) return res.send(err);
            return res.send(profiles);
        });
};
