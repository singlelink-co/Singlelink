// Third-party assets & dependencies
const express = require('express');
const mongoose = require('mongoose');

const UserController = express();

// Routing
UserController.all('/login', require('./login'));
UserController.all('/create', require('./create'));
UserController.all('/request-reset-password', require('./request-password-reset'));
UserController.all('/reset-password', require('./reset-password'));

// From here on out, require authentication
UserController.use(require('../../middleware/auth'));

UserController.all('/fetch', require('./fetch'));
UserController.all('/set-active', require('./set-active'));

module.exports = UserController;
