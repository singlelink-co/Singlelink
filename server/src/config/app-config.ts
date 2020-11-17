export let appConfig = require("./config.json");

/**
 * The name of your database.
 */
if (process.env.DATABASE) {
  appConfig.database = process.env.DATABASE;
}

/**
 * The secret that will be used to sign tokens.
 */
if (process.env.SECRET) {
  appConfig.secret = process.env.SECRET;
}

/**
 * Optional. Capture Key from Neutron's Capture product for site screenshots.
 */
if (process.env.CAPTURE_KEY) {
  appConfig.captureKey = process.env.CAPTURE_KEY;
}

/**
 * The port that the server will use.
 */
if (process.env.PORT) {
  appConfig.port = process.env.PORT;
}

/**
 * The domain that this server will be hosted on.
 */
if (process.env.API_DOMAIN) {
  appConfig.apiDomain = process.env.API_DOMAIN;
}

/**
 * The domain that the client is hosted at.
 */
if (process.env.CLIENT_DOMAIN) {
  appConfig.clientDomain = process.env.CLIENT_DOMAIN;
}

/**
 * An email that can be used to contact the administrator of this server.
 */
if (process.env.CONTACT_EMAIL) {
  appConfig.contactEmail = process.env.CONTACT_EMAIL;
}

/**
 * The email that will be used to send emails (such as password reset emails).
 * Must be registered on AWS.
 */
if (process.env.AWS_SENDER_EMAIL_ADDRESS) {
  appConfig.aws.senderEmailAddress = process.env.AWS_SENDER_EMAIL_ADDRESS;
}

/**
 * The AWS Region.
 */
if (process.env.AWS_REGION) {
  appConfig.aws.region = process.env.AWS_REGION;
}

/**
 * The AWS Access Key.
 */
if (process.env.AWS_ACCESS_KEY) {
  appConfig.aws.accessKey = process.env.AWS_ACCESS_KEY;
}

/**
 * The AWS Secret Key.
 */
if (process.env.AWS_SECRET_KEY) {
  appConfig.aws.secretKey = process.env.AWS_SECRET_KEY;
}

/**
 * S3 Bucket Endpoint for users who are enabling S3 Bucket support.
 */
if (process.env.S3_ENDPOINT) {
  appConfig.s3Bucket.endPoint = process.env.S3_ENDPOINT;
}

/**
 * S3 Bucket Name.
 */
if (process.env.S3_BUCKETNAME) {
  appConfig.s3Bucket.bucketName = process.env.S3_BUCKETNAME;
}

/**
 * S3 Bucket Port.
 */
if (process.env.S3_PORT) {
  appConfig.s3Bucket.port = Number.parseInt(process.env.S3_PORT);
}

/**
 * Does this S3 Bucket use SSL?
 */
if (process.env.S3_USE_SSL) {
  appConfig.s3Bucket.useSSL = process.env.S3_USE_SSL == "true";
}

/**
 * Does this S3 Bucket use SSL?
 */
if (process.env.S3_ACCESS_KEY) {
  appConfig.s3Bucket.accessKey = process.env.S3_ACCESS_KEY;
}

/**
 * S3 Bucket Secret Key
 */
if (process.env.S3_SECRET_KEY) {
  appConfig.s3Bucket.secretKey = process.env.S3_SECRET_KEY;
}

if (appConfig.s3Bucket.endPoint) {
  console.log("S3 Bucket caching is enabled!");
}
