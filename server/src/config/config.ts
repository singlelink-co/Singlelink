import * as fs from "fs";

if (!fs.existsSync(__dirname + "/../config.json")) {
  fs.copyFileSync(__dirname + "/../config.template.json", __dirname + "/../config.json");

  console.log("New configuration generated: " + __dirname + ".json");
} else {
  console.log("Using existing configuration: " + __dirname + ".json");
}

export let config = require("../config.json");

/**
 * The name of your database.
 */
if (process.env.DATABASE) {
  config.database = process.env.DATABASE;
}

/**
 * The secret that will be used to sign tokens.
 */
if (process.env.SECRET) {
  config.secret = process.env.SECRET;
}

/**
 * Optional. Capture Key from Neutron's Capture product for site screenshots.
 */
if (process.env.CAPTURE_KEY) {
  config.captureKey = process.env.CAPTURE_KEY;
}

/**
 * The port that the server will use.
 */
if (process.env.HOST) {
  config.port = process.env.HOST;
}

/**
 * The port that the server will use.
 */
if (process.env.PORT) {
  config.port = process.env.PORT;
}

/**
 * The domain that this server will be hosted on.
 */
if (process.env.API_DOMAIN) {
  config.apiDomain = process.env.API_DOMAIN;
}

/**
 * The domain that the client is hosted at.
 */
if (process.env.CLIENT_DOMAIN) {
  config.clientDomain = process.env.CLIENT_DOMAIN;
}

/**
 * An email that can be used to contact the administrator of this server.
 */
if (process.env.CONTACT_EMAIL) {
  config.contactEmail = process.env.CONTACT_EMAIL;
}

/**
 * The email that will be used to send emails (such as password reset emails).
 * Must be registered on AWS.
 */
if (process.env.AWS_SENDER_EMAIL_ADDRESS) {
  config.aws.senderEmailAddress = process.env.AWS_SENDER_EMAIL_ADDRESS;
}

/**
 * The AWS Region.
 */
if (process.env.AWS_REGION) {
  config.aws.region = process.env.AWS_REGION;
}

/**
 * The AWS Access Key.
 */
if (process.env.AWS_ACCESS_KEY) {
  config.aws.accessKey = process.env.AWS_ACCESS_KEY;
}

/**
 * The AWS Secret Key.
 */
if (process.env.AWS_SECRET_KEY) {
  config.aws.secretKey = process.env.AWS_SECRET_KEY;
}

/**
 * S3 Bucket Endpoint for users who are enabling S3 Bucket support.
 */
if (process.env.S3_ENDPOINT) {
  config.s3Bucket.endPoint = process.env.S3_ENDPOINT;
}

/**
 * S3 Bucket Name.
 */
if (process.env.S3_BUCKETNAME) {
  config.s3Bucket.bucketName = process.env.S3_BUCKETNAME;
}

/**
 * S3 Bucket Port.
 */
if (process.env.S3_PORT) {
  config.s3Bucket.port = Number.parseInt(process.env.S3_PORT);
}

/**
 * Does this S3 Bucket use SSL?
 */
if (process.env.S3_USE_SSL) {
  config.s3Bucket.useSSL = process.env.S3_USE_SSL == "true";
}

/**
 * Does this S3 Bucket use SSL?
 */
if (process.env.S3_ACCESS_KEY) {
  config.s3Bucket.accessKey = process.env.S3_ACCESS_KEY;
}

/**
 * S3 Bucket Secret Key
 */
if (process.env.S3_SECRET_KEY) {
  config.s3Bucket.secretKey = process.env.S3_SECRET_KEY;
}

/**
 * Mixpanel analytics token
 */
if (process.env.MIXPANEL_TOKEN) {
  config.analytics.mixpanelToken = process.env.MIXPANEL_TOKEN;
}

if (process.env.DELETE_ADDON_INSTALLS_THRESHOLD) {
  config.settings.marketplaceDeleteAddonThreshold = process.env.DELETE_ADDON_INSTALLS_THRESHOLD;
} else if (!config.settings?.marketplaceDeleteAddonThreshold) {
  config.settings.marketplaceDeleteAddonThreshold = 10;
}

if (process.env.GOOGLE_CLIENT_ID) {
  config.google.clientId = process.env.GOOGLE_CLIENT_ID;
}

if (process.env.GOOGLE_CLIENT_SECRET) {
  config.google.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
}

if (process.env.GOOGLE_REDIRECT_URL) {
  config.google.redirectUrl = process.env.GOOGLE_REDIRECT_URL;
}

// Extra logic for debug messages

if (config.s3Bucket.endPoint) {
  console.log("S3 Bucket caching is enabled!");
}
