// Third-party assets & dependencies
const express = require('express');
const mongoose = require('mongoose');

const LinkController = express();

// Routing
//ProfileController.all('/', require('./'));

// From here on out, require authentication
LinkController.use(require('../../middleware/auth'));

LinkController.post('/create', require('./create'));
LinkController.post('/update', require('./update'));
LinkController.post('/destroy', require('./destroy'));
LinkController.post('/reorder', require('./reorder'));
LinkController.post('/reset-order', require('./reset-order'));

module.exports = LinkController;
