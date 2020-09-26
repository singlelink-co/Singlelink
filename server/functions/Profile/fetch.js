const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');
const Visit = mongoose.model('Visit');
const Link = mongoose.model('Link');
const User = mongoose.model('User');
const Theme = mongoose.model('Theme');

module.exports = (req, res) => {
    if(!req.body.handle && !req.params.handle) return res.status(400).send('Handle required to find account');
    let payload = {
        profile: null,
        links: null,
        user: null,
        theme: null
    };
    Profile.findOne({
        handle: req.body.handle || req.params.handle
    }, async (err, profile) => {
            if(err) return res.send(err);
            if(!profile) return res.status(404).send('Profile not found');
            if(profile.visibility == 'unpublished') return res.status(404).send('Profile not found');
            payload.profile = profile;
            if(profile.theme) payload.theme = await Theme.findOne({_id: profile.theme || ''});
                User.findOne({
                    _id: profile.parent
                }, (err, user) => {
                    if(err) return res.send(err);
                    if(!user) return res.status(404).send('Profile parent not found');
                    payload.user = user;
                    Link.find({
                        parent: profile._id
                    }, async (err, links) => {
                        if(err) return res.send(err);
                        payload.links = links || [];
                        let visit = await new Visit({
                            type: 'Page',
                            referral: profile._id
                        }).save();
                        res.send(payload);
                    });
                })
            });
}
