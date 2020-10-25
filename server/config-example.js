// Once filled, move this file to config.js to use it!
module.exports = {
  // Is production?
  production: true,
  // MongoDB Connection URI
  database: 'mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]\n',
  // Your JWT secret
  secret: 'Your secret here!',
  // Capture key is for thumbnails, obtainable from capture.neutron.so - this is not required
  capture_key: '',
  // API port
  port: 80,
  // API Domain
  apiDomain: "https://api.singlelink.co",
  // Client domain
  clientDomain: "https://app.singlelink.co",
  // Contact email
  contactEmail: "contact@neutroncreative.com",
  // AWS SES credentials for email
  aws: {
    senderEmailAddress: "",
    region: "",
    accessKey: "",
    secretKey: ""
  },
  // AWS/DO Bucket credentials for SSL
  // Singlelink is a proud partner of DigitalOcean... we recommend their services when available!
  s3Bucket: {
    endPoint: "",
    bucketName: "",
    port: 443,
    useSSL: true,
    accessKey: "",
    secretKey: ""
  },
};
