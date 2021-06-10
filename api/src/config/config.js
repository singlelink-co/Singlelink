"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var fs = require("fs");
if (!fs.existsSync(__dirname + "/../config.json")) {
    fs.copyFileSync(__dirname + "/../config.template.json", __dirname + "/../config.json");
    console.log("New configuration generated: " + __dirname + ".json");
}
else {
    console.log("Using existing configuration: " + __dirname + ".json");
}
exports.config = require("../config.json");
/**
 * The name of your database.
 */
if (process.env.DATABASE) {
    exports.config.database = process.env.DATABASE;
}
/**
 * The secret that will be used to sign tokens.
 */
if (process.env.SECRET) {
    exports.config.secret = process.env.SECRET;
}
/**
 * Optional. Capture Key from Neutron's Capture product for site screenshots.
 */
if (process.env.CAPTURE_KEY) {
    exports.config.captureKey = process.env.CAPTURE_KEY;
}
/**
 * The port that the server will use.
 */
if (process.env.HOST) {
    exports.config.host = process.env.HOST;
}
/**
 * The port that the server will use.
 */
if (process.env.PORT) {
    exports.config.port = process.env.PORT;
}
/**
 * The domain that this server will be hosted on.
 */
if (process.env.API_DOMAIN) {
    exports.config.apiDomain = process.env.API_DOMAIN;
}
/**
 * The domain that the client is hosted at.
 */
if (process.env.EDITOR_DOMAIN) {
    exports.config.editorDomain = process.env.EDITOR_DOMAIN;
}
/**
 * An email that can be used to contact the administrator of this server.
 */
if (process.env.CONTACT_EMAIL) {
    exports.config.contactEmail = process.env.CONTACT_EMAIL;
}
/**
 * The email that will be used to send emails (such as password reset emails).
 * Must be registered on AWS.
 */
if (process.env.AWS_SENDER_EMAIL_ADDRESS) {
    exports.config.aws.senderEmailAddress = process.env.AWS_SENDER_EMAIL_ADDRESS;
}
/**
 * The AWS Region.
 */
if (process.env.AWS_REGION) {
    exports.config.aws.region = process.env.AWS_REGION;
}
/**
 * The AWS Access Key.
 */
if (process.env.AWS_ACCESS_KEY) {
    exports.config.aws.accessKey = process.env.AWS_ACCESS_KEY;
}
/**
 * The AWS Secret Key.
 */
if (process.env.AWS_SECRET_KEY) {
    exports.config.aws.secretKey = process.env.AWS_SECRET_KEY;
}
/**
 * S3 Bucket Endpoint for users who are enabling S3 Bucket support.
 */
if (process.env.S3_ENDPOINT) {
    exports.config.s3Bucket.endPoint = process.env.S3_ENDPOINT;
}
/**
 * S3 Bucket Name.
 */
if (process.env.S3_BUCKETNAME) {
    exports.config.s3Bucket.bucketName = process.env.S3_BUCKETNAME;
}
/**
 * S3 Bucket Port.
 */
if (process.env.S3_PORT) {
    exports.config.s3Bucket.port = Number.parseInt(process.env.S3_PORT);
}
/**
 * Does this S3 Bucket use SSL?
 */
if (process.env.S3_USE_SSL) {
    exports.config.s3Bucket.useSSL = process.env.S3_USE_SSL == "true";
}
/**
 * Does this S3 Bucket use SSL?
 */
if (process.env.S3_ACCESS_KEY) {
    exports.config.s3Bucket.accessKey = process.env.S3_ACCESS_KEY;
}
/**
 * S3 Bucket Secret Key
 */
if (process.env.S3_SECRET_KEY) {
    exports.config.s3Bucket.secretKey = process.env.S3_SECRET_KEY;
}
/**
 * Mixpanel analytics token
 */
if (process.env.MIXPANEL_TOKEN) {
    exports.config.analytics.mixpanelToken = process.env.MIXPANEL_TOKEN;
}
if (process.env.DELETE_ADDON_INSTALLS_THRESHOLD) {
    exports.config.settings.marketplaceDeleteAddonThreshold = process.env.DELETE_ADDON_INSTALLS_THRESHOLD;
}
else if (!((_a = exports.config.settings) === null || _a === void 0 ? void 0 : _a.marketplaceDeleteAddonThreshold)) {
    exports.config.settings.marketplaceDeleteAddonThreshold = 10;
}
if (process.env.GOOGLE_CLIENT_ID) {
    exports.config.google.clientId = process.env.GOOGLE_CLIENT_ID;
}
if (process.env.GOOGLE_CLIENT_SECRET) {
    exports.config.google.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
}
if (process.env.GOOGLE_REDIRECT_DOMAIN) {
    exports.config.google.redirectDomain = process.env.GOOGLE_REDIRECT_DOMAIN;
}
// Extra logic for debug messages
if (exports.config.s3Bucket.endPoint) {
    console.log("S3 Bucket caching is enabled!");
}
