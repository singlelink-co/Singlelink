var mongoose = require('mongoose');

var LinkSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    subtitle: String,
    url: {
        type: String,
        default: '#',
        required: true
    },
    style: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    custom_css: String,
    order: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Link', LinkSchema);