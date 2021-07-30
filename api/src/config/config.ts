import * as fs from "fs";

if (!fs.existsSync(__dirname + "/../config.json")) {
  fs.copyFileSync(__dirname + "/../config.template.json", __dirname + "/../config.json");

  console.log("New configuration generated: " + __dirname + ".json");
} else {
  console.log("Using existing configuration: " + __dirname + ".json");
}

export let config = require("../config.json");

// Set defaults if missing
if (config.host === undefined) {
  config.host = "0.0.0.0";
}
if (config.port === undefined) {
  config.port = "80";
}

if (config.validateEmails === undefined) {
  config.validateEmails = true;
}

if (config.settings?.marketplaceDeleteAddonThreshold === undefined) {
  config.settings.marketplaceDeleteAddonThreshold = 10;
}


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
 * The port that the server will use.
 */
if (process.env.HOST) {
  config.host = process.env.HOST;
}

/**
 * The port that the server will use.
 */
if (process.env.PORT) {
  config.port = process.env.PORT;
}

/**
 * The domain that the api will be hosted on.
 */
if (process.env.API_URL) {
  config.apiUrl = process.env.API_URL;
}

/**
 * The domain that the editor is hosted at.
 */
if (process.env.EDITOR_URL) {
  config.editorUrl = process.env.EDITOR_URL;
}

/**
 * The domain that the renderer is hosted at.
 */
if (process.env.RENDERER_URL) {
  config.rendererUrl = process.env.RENDERER_URL;
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
}

if (process.env.GOOGLE_CLIENT_ID) {
  config.google.clientId = process.env.GOOGLE_CLIENT_ID;
}

if (process.env.GOOGLE_CLIENT_SECRET) {
  config.google.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
}

if (process.env.GOOGLE_REDIRECT_URL) {
  config.google.redirectDomain = process.env.GOOGLE_REDIRECT_URL;
}

if (process.env.ALLOW_X_FORWARD_HEADER) {
  config.allowXForwardHeader = process.env.ALLOW_X_FORWARD_HEADER == "true";
}

if (process.env.VALIDATE_EMAILS) {
  config.validateEmails = process.env.VALIDATE_EMAILS == "true";
}
