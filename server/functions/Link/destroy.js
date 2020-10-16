const mongoose = require('mongoose');

const Link = mongoose.model('Link');

module.exports = async (req, res) => {
    if(!req.body.target) return res.status(400).send('Target required');
    Link.findOneAndDelete({
        _id: req.body.target
    }, async (err) => {
        if(err) return res.send(err);
        let links = await Link.find({parent:req.user.active_profile._id}).sort({"order":1});;
        for(let i=0;i<links.length;i++) {
            links[i].order = i;
            await links[i].save();
        }
        links = await Link.find({parent:req.user.active_profile._id});
        return res.send(links);
    });
};
