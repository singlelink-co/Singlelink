// Third-party assets & dependancies
const express = require('express');

const AnalyticsController = express();

// Routing
AnalyticsController.get('/fetch', require('./fetch'));

AnalyticsController.all('/link/:_id', require('./link'));

module.exports = AnalyticsController;
