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
  custom_domain: {
    type: String,
    unique: true
  },
  theme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme',
  },
});

ProfileSchema.virtual('permissions').get(function () {
  if (this.members) return this.members.push(this.parent);
  return [this.parent];
});

let Profile = mongoose.model('Profile', ProfileSchema);

const profileEventEmitter = Profile.watch();

profileEventEmitter.on('change', change => {
  if (change.fullDocument) {
    let customDomain = change.fullDocument.custom_domain;

    if (customDomain) {
      proxy.register(customDomain, "127.0.0.1:4444", {
        ssl: {
          letsencrypt: {
            email: 'letsencrypt@neutroncreative.com', // Domain owner/admin email
            production: config.production, // WARNING: Only use this flag when the proxy is verified to work correctly to avoid being banned!
          }
        }
      });
    }
  }
});

module.exports = Profile;
