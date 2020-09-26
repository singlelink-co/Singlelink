const mongoose = require('mongoose');

const Theme = mongoose.model('Theme');

module.exports = (req, res) => {
    let payload = [];
    Theme.find({
        parent: req.user._id
    })
        .exec((err, themes) => {
            if(err) return res.send(err);
            payload = payload.concat(themes);
            Theme.find({
                global: true,
            })
                .exec((err, themes) => {
                    if(err) return res.send(err);
                    for(let i=0;i<themes.length;i++) {
                        if(!themes[i].parent.equals(req.user._id)) payload = payload.concat(themes[i]);
                    }
                    return res.send(payload);
                });
        });
}