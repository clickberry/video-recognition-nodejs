/**
 * @fileOverview HTTP API endpoints.
 */

var express = require('express');
var router = express.Router();

// mounting video API
var videoApi = require('./video');
router.use('/video', videoApi);

module.exports = router;