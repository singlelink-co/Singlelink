export let config = require("../config.json");

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

if (config.s3Bucket.endPoint) {
  console.log("S3 Bucket caching is enabled!");
}
