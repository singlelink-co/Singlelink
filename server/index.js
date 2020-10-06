const express = require('express');
const getPort = require('get-port');
const https = require('https');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require("express-rate-limit");

global.config = require('./config');

global.mongodb = true;

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

app.get('/', require('./functions/Misc/status'));

const User = require('./models/User');
const Profile = require('./models/Profile');
const Link = require('./models/Link');
const Theme = require('./models/Theme');
const Visit = require('./models/Visit');

app.use('/user', require('./functions/User'));
app.use('/profile', require('./functions/Profile'));
app.use('/link', require('./functions/Link'));
app.use('/theme', require('./functions/Theme'));
app.use('/analytics', require('./functions/Analytics'))

app.listen(port, () => {
  console.log(`🔗 Singlelink API listening on port ${port}`)
})
