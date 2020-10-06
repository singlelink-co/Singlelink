const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'Link',
            'Page'
        ]
    },
    ip_address: String,
    referral: {
        type: mongoose.Schema.Types.ObjectId,
    },
});

module.exports = mongoose.model('Visit', VisitSchema);
