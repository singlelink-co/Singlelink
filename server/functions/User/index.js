// Third-party assets & dependancies
var express = require('express');
var mongoose = require('mongoose');

var UserController = express();

// Routing
UserController.all('/login', require('./login'));
UserController.all('/create', require('./create'));

// From here on out, require authentication
UserController.use(require('../../middleware/auth'));

UserController.all('/fetch', require('./fetch'));
UserController.all('/set-active', require('./set-active'));

module.exports = UserController;
