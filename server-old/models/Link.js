const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
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
  useDeepLink: false,
  custom_css: String,
  order: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Link', LinkSchema);
