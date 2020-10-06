const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  handle: {
    type: String,
    unique: true,
    required: true
  },
  image_url: String,
  headline: String,
  subtitle: String,
  social: [{
    icon: String,
    link: String,
    alt: String,
  }],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  visibility: {
    type: String,
    default: 'unpublished',
    required: true,
    enum: [
      'unpublished',
      'published',
      'published-18+'
    ]
  },
  custom_css: String,
  custom_html: String,
  theme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme',
  },
});

ProfileSchema.virtual('permissions').get(function() {
    if(this.members) return this.members.push(this.parent);
    return [this.parent];
});

module.exports = mongoose.model('Profile', ProfileSchema);
