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

VisitSchema.virtual('created_on').get(function() {
  return this._id.getTimestamp();
});

module.exports = mongoose.model('Visit', VisitSchema);
