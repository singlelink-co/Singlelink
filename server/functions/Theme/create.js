const mongoose = require('mongoose');

const Theme = mongoose.model('Theme');

module.exports = (req, res) => {
    if(!req.body.label) return res.status(400).send('Theme label required');
    new Theme({
        label: req.body.label,
        colors: req.body.colors || null,
        custom_css: req.body.custom_css || null,
        custom_html: req.body.custom_html || null,
        parent: req.user._id
    }).save((err, link) => {
        if(err) return res.send(err);
        return res.send(link);
    });
};
