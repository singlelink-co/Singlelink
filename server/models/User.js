var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    hash: {
        type: String,
        required: true
    },
    avatar_url: String,
    active_profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
});

module.exports = mongoose.model('User', UserSchema);