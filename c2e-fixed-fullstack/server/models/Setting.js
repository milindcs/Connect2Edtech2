const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Connect2EdTech' },
    siteDescription: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    socialFacebook: { type: String, default: '' },
    socialTwitter: { type: String, default: '' },
    socialInstagram: { type: String, default: '' },
    socialLinkedin: { type: String, default: '' },
    socialGithub: { type: String, default: '' },
    socialYoutube: { type: String, default: '' },
    enrollmentOpen: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    footerText: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingsSchema);
