/**
 * @fileOverview Video endpoints.
 */

var express = require('express');
var router = express.Router();

var upload = require('./upload');

/**
 * Upload endpoint.
 */
router.post('/',
  upload
  );

module.exports = router;