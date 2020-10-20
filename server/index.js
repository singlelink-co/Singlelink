'use strict';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const AWS = require("aws-sdk");

global.config = require('./config');
global.mongodb = true;
global.environment = process.env.NODE_ENV || 'development';

console.log(`Singlelink is starting in ${global.environment} mode!`);
console.log(`Production mode: ${config.production}`);

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
  })
  .catch(error => function (error) {
    global.mongodb = false;
    console.log('Error connecting to MongoDB');
    console.log('-------------------------------------');
    console.log(error);
  });

const app = express();
let port = process.env.API_PORT || config.port || 80;

// Rate limit emails.
const emailRateLimiter = rateLimit({
  windowMs: 180 * 60 * 1000, // 180 minutes
  max: 3
});

// Setup cors and JSON parsing
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/user/request-password-reset", emailRateLimiter);

// Require modules so that we initialize them before using.
const User = require('./models/User');
const Profile = require('./models/Profile');
const Link = require('./models/Link');
const Theme = require('./models/Theme');
const Visit = require('./models/Visit');

// Setup routes
app.use(require('./middleware/custom-domains'));
app.use('/user', require('./functions/User'));
app.use('/profile', require('./functions/Profile'));
app.use('/link', require('./functions/Link'));
app.use('/theme', require('./functions/Theme'));
app.use('/visit', require('./functions/Visit'));
app.use('/analytics', require('./functions/Analytics'));

app.get('/', require('./functions/Misc/status'));

app.listen(4444, '127.0.0.1', () => {
  console.log('🔗 Singlelink API started on port 4444');
});

// Once the DB is connected to, we can start the server and setup Greenlock.
const db = mongoose.connection;

db.once('open', async () => {
  await initProxy(db, port);
});

/**
 * Initialize proxy server for custom domains.
 * @param connection Pass in mongodb's connection value from mongoose.
 * @param port Port to open for incoming connections
 */
async function initProxy(connection, port) {
  global.proxy = require('redbird')({
    port: port, // http port is needed for LetsEncrypt challenge during request / renewal. Also enables automatic http->https redirection for registered https routes.
    letsencrypt: {
      path: __dirname + '/certs',
      port: 9999 // LetsEncrypt minimal web server port for handling challenges. Routed 80->9999, no need to open 9999 in firewall. Default 3000 if not defined.
    },
    ssl: {
      http2: true,
      port: 443 // SSL port used to serve registered https routes with LetsEncrypt certificate.
    }
  });

  proxy.register('singlelink.localhost', "127.0.0.1:4444");
  proxy.register("localhost", "127.0.0.1:4444");
  proxy.register(config.apiDomain, "127.0.0.1:4444");

  let profiles = await Profile.find({"custom_domain": {"$nin": [null, ""]}});

  console.log(`${profiles.length} domains found.`);

  if (environment === 'development') {
    for (let profile of profiles) {
      proxy.register(profile.custom_domain, "127.0.0.1:4444");
    }
  } else {
    for (let profile of profiles) {
      proxy.register(profile.custom_domain, "127.0.0.1:4444", {
        ssl: {
          letsencrypt: {
            email: 'letsencrypt@neutroncreative.com', // Domain owner/admin email
            production: config.production, // WARNING: Only use this flag when the proxy is verified to work correctly to avoid being banned!
          }
        }
      });
    }
  }

  console.log(`Reverse proxy started on port ${port}, listening for connections`);
}
