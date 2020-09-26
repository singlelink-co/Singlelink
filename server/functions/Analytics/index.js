// Third-party assets & dependancies
var express = require('express');

var AnalyticsController = express();

// Routing
AnalyticsController.get('/fetch', require('./fetch'));

AnalyticsController.all('/link/:_id', require('./link'));

module.exports = AnalyticsController;
