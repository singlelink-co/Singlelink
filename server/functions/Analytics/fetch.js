const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Profile = mongoose.model('Profile');
const Link = mongoose.model('Link');
const Theme = mongoose.model('Theme');

module.exports = async (req, res) => {
    // Fetch items from database
    let users = await User.find();
    let profiles = await Profile.find();
    let links = await Link.find();
    let themes = await Theme.find();

    // Compute additional values from items
        // Filter published profiles from unpublished profiles
        let profiles_published = 0;
        for(let i=0;i<profiles.length;i++) {
            if(profiles[i].visibility != 'unpublished') profiles_published++;
        }

    // Return payload
    return res.send({
        users: users.length,
        profiles: profiles.length,
        profiles_published: profiles_published,
        links: links.length,
        themes: themes.length
    });
}