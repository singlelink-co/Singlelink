const express = require('express');
const getPort = require('get-port');
const https = require('https');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require("express-rate-limit");

global.config = require('./config');

global.mongodb = true;

AWS.config.update({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secretKey
  },
  apiVersion: '2010-12-01'
});

mongoose.connect(global.config.database,
  {
    useNewUrlParser: true
  }).catch(error => function (error) {
  global.mongodb = false;
  console.log('Error connecting to MongoDB');
  console.log('-------------------------------------');
  console.log(error);
});

const app = express();
const environment = process.env.NODE_ENV || 'development';
let port;
let sslPort;

const emailRateLimiter = rateLimit({
  windowMs: 180 * 60 * 1000, // 180 minutes
  max: 3
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/user/request-password-reset", emailRateLimiter);
port = process.env.API_PORT || config.port || 80;
sslPort = process.env.API_SSL_PORT || config.sslPort || 443;

const User = require('./models/User');
const Profile = require('./models/Profile');
const Link = require('./models/Link');
const Theme = require('./models/Theme');
const Visit = require('./models/Visit');

app.use(require('./middleware/custom-domains'));
app.use('/user', require('./functions/User'));
app.use('/profile', require('./functions/Profile'));
app.use('/link', require('./functions/Link'));
app.use('/theme', require('./functions/Theme'));
app.use('/analytics', require('./functions/Analytics'))

app.get('/', require('./functions/Misc/status'));

app.listen(port, () => {
  console.log(`🔗 Singlelink API listening on port ${port}`)
});

app.listen(sslPort, () => {
  console.log(`🔗 Singlelink API listening on SSL port 443`)
});


// const store = require('greenlock-storage-s3').create({
//   accessKeyId: config.s3Bucket.accessKey,
//   secretAccessKey: config.s3Bucket.secretKey,
//   bucketRegion: config.s3Bucket.endPoint,
//   bucketName: config.s3Bucket.bucketName,
//   configDir: 'acme/',
//   accountsDir: 'accounts/',
//   debug: true
// });
//
// const greenlock = require('greenlock-express').init({
//   packageRoot: __dirname,
//   store: store,
//   maintainerEmail: config.contactEmail,
//   cluster: true
// }).serve(app);
//
// greenlock.manager.defaults({
//   subscriberEmail: "mycompany@example.com",
//   agreeToTerms: true
// });
