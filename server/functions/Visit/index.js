// Third-party assets & dependencies
const express = require('express');

const VisitController = express();

// From here on out, require authentication
VisitController.use(require('../../middleware/auth'));

// Routing
VisitController.get('/fetch', require('./fetch'));

module.exports = VisitController;
