// Third-party assets & dependancies
var express = require('express');
var mongoose = require('mongoose');

var LinkController = express();

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
