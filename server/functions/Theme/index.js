// Third-party assets & dependencies
var express = require('express');
var mongoose = require('mongoose');

var ThemeController = express();

// From here on out, require authentication
ThemeController.use(require('../../middleware/auth'));

ThemeController.post('/fetch', require('./fetch'));
ThemeController.post('/create', require('./create'));

module.exports = ThemeController;
