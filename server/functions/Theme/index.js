// Third-party assets & dependencies
const express = require('express');
const mongoose = require('mongoose');

const ThemeController = express();

// From here on out, require authentication
ThemeController.use(require('../../middleware/auth'));

ThemeController.post('/fetch', require('./fetch'));
ThemeController.post('/create', require('./create'));

module.exports = ThemeController;
