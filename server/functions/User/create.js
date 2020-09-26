var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var md5 = require('md5');

var User = mongoose.model('User');
var Profile = mongoose.model('Profile');

module.exports = (req, res) => {
    if(!req.body.email) return res.status(400).send('Missing email');
    if(!req.body.password) return res.status(400).send('Missing password');
    User.findOne({ email : req.body.email }, function(err, user) {
        if (err) return res.status(500).send(err);
        if (user) return res.status(404).send('User with that email address already exists');
        bcrypt.hash(req.body.password, null, null, function (err, hash) {
            if (err) return res.status(500).send(err);
            new User({
                name: req.body.name || null,
                email: req.body.email || null,
                password: hash,
                hash: md5(req.body.email)
            }).save(function (err, user) {

                new Profile({parent: user._id, handle: req.body.handle || user._id }).save(function(err, profile) {
                    user.active_profile = profile._id;
                    user.save(function (err, user) {
                        if (err) return res.send(err);
                        return res.status(201).json({
                            user: user,
                            active_profile: profile,
                            token: jwt.sign(
                                {
                                    email: user.email,
                                }, global.config.secret, {
                                    expiresIn: '168h'
                                }
                            )
                        });
                    });
                });
            });
        });
    });
}