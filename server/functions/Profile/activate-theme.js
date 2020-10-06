var mongoose = require('mongoose');

var Profile = mongoose.model('Profile');

module.exports = (req, res) => {
    req.user.active_profile.theme = req.body.theme || null;
    req.user.active_profile.save((err, profile) => {
        if(err) return res.send(err);
        return res.send(profile);
    });
}