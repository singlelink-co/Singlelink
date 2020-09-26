var mongoose = require('mongoose');

var Profile = mongoose.model('Profile');
var Link = mongoose.model('Link');

module.exports = (req, res) => {
    if(!req.user.active_profile) return res.status(400).send('You need an active profile to do this');
    Link.find({parent:req.user.active_profile._id})
        .exec((err, links) => {
            if(err) return res.send(err);
            return res.send(links);
        });
}