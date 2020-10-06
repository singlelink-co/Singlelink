const mongoose = require('mongoose');

const Link = mongoose.model('Link');

module.exports = async function(req, res) {
    if(!req.user.active_profile) return res.status(400).send('You need an active profile to do this');
    let links = await Link.find({parent:req.user.active_profile._id}).sort({"order":1});;
    for(let i=0;i<links.length;i++) {
        links[i].order = i;
        await links[i].save();
    }
    links = await Link.find({parent:req.user.active_profile._id});
    return res.send(links);
}