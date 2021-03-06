/**
 * @fileOverview POST /api/video endpoint.
 */

// env
if (!process.env.S3_BUCKET) {
  console.log("S3_BUCKET environment variable required.");
  process.exit(1);
}
var bucket = process.env.S3_BUCKET;

var debug = require('debug')('clickberry:video-recognition:web');
var uuid = require('node-uuid');
var path = require('path');
var multiparty = require('multiparty');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({signatureVersion: 'v4'});
var Bus = require('../../../lib/bus');
var bus = new Bus();


/**
 * Helper function fo checking wheter request is multipart/form-data request.
 *
 * @method     isFormData
 * @param      {Object}   req     Express Request object.
 * @return     {boolean}  true if request is multipart/form-data request.
 */
function isFormData(req) {
  var type = req.headers['content-type'] || '';
  return 0 === type.indexOf('multipart/form-data');
}

/**
 * Helper function for checking whether part is video file.
 *
 * @method     isVideoFile
 * @param      {Object}   part  Multiparty Part object.
 * @return     {boolean}  true if part has Content-Type header video/*
 */
function isVideoFile(part) {
  return 0 === part.headers['content-type'].indexOf('video/');
}

 /**
 * Builds full S3 object URI.
 *
 * @method     getObjectUri
 * @param      {string}  bucket  S3 bucket name.
 * @param      {string}  key     Object key name.
 * @return     {string}  Full object URI.
 */
function getS3Uri(bucket, key) {
  return 'https://' + bucket + '.s3.amazonaws.com/' + key;
}


module.exports = function (req, res, next) {
  if (!isFormData(req)) {
    return res.status(406).send({ message: 'Not Acceptable: expecting multipart/form-data' });
  }

  var id = req.query.id || uuid.v4();

  // parsing request
  var form = new multiparty.Form({
    autoFields: true
  });

  var filesCount = 0;
  form.on('part', function (part) {
    if (filesCount > 0) {
      return;
    }

    if (!isVideoFile(part)) {
      return res.status(400).send({ message: 'Bad Request: expecting video/* file' });
    }

    // upload to S3
    filesCount++;
    var key = id + path.extname(part.filename);
    var uri = getS3Uri(bucket, key);
    debug('Uploading video file ' + id + ' of size ' + part.byteCount + ' to ' + uri);

    var params = {
      Bucket: bucket,
      Key: key,
      ACL: 'public-read',
      Body: part,
      ContentLength: part.byteCount,
      ContentType: part.headers['content-type']
    };

    s3.putObject(params, function (err) {
      if (err) return next(err);

      debug("Video " + id + " successfully uploaded to " + uri);

      // send event
      var event = {
        id: id,
        uri: uri
      };
      bus.publishVideoUploaded(event, function (err) {
        if (err) return next(err);

        res.json(event);
      });
    });
  });

  form.on('error', function (err) {
    return next(err);
  });

  form.parse(req);
};

