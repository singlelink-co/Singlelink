var mongoose = require('mongoose');

var Link = mongoose.model('Link');

module.exports = async (req, res) => {
    if(!req.user.active_profile) return res.status(400).send('You need an active profile to do this');
    if(!req.body.target) return res.status(400).send('Target required');
    if(req.body.new_index === null) return res.status(400).send('New index required');
    if(req.body.old_index === null) return res.status(400).send('Old index required');

    let links = await Link.find({parent: req.user.active_profile._id}).sort({"order":1});

    console.log('Before');
    console.log(links);

    let end_links = links.splice(req.body.new_index);
    if(req.body.old_index > req.body.new_index) {
        // Search end_links
        end_links.splice(req.body.old_index - req.body.new_index, 1);
    } else {
        // Search links
        links.splice(req.body.old_index, 1);
    }

    let target = await Link.findOne({_id:req.body.target});

    links = links.concat(end_links);

    links.splice(req.body.new_index, 0,target);

    for(let i=0;i<links.length;i++) {
        links[i].order = i;
        await links[i].save();
    }

    console.log('After');
    console.log(links);

    return res.send(links);

}