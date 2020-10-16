const mongoose = require('mongoose');

const Link = mongoose.model('Link');

module.exports = (req, res) => {
    if(!req.body.target) return res.status(400).send('Target required');
    Link.findOne({
        _id: req.body.target
    }, (err, link) => {
        if(err) return res.send(err);
        if(req.body.label) link.label = req.body.label;
        link.subtitle = req.body.subtitle || null;
        if(req.body.url) link.url = req.body.url;
        link.custom_css = req.body.custom_css || null;
        link.save((err, link) => {
            if(err) return res.send(err);
            Link.find({
                parent: req.user.active_profile
            }, (err, links) => {
                if(err) return res.send(err);
                res.send(links);
            });
        });
    });
};
