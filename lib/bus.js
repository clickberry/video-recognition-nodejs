/**
 * @fileOverview Service bus integration.
 */

// env
if (!process.env.NSQD_ADDRESS) {
  console.log("NSQD_ADDRESS environment variable required.");
  process.exit(1);
}

var events = require('events');
var util = require('util');
var nsq = require('nsqjs');
var debug = require('debug')('clickberry:video-recognition:bus');

/**
 * Emits events to NSQ bus.
 *
 * @class
 * @param      {Object}  options  Configuration options.
 */
function Bus(options) {
  options = options || {};
  options.nsqdAddress = options.nsqdAddress || process.env.NSQD_ADDRESS;
  options.nsqdPort = options.nsqdPort || process.env.NSQD_PORT || '4150';

  events.EventEmitter.call(this);

  // register writers
  this._writer = new nsq.Writer(options.nsqdAddress, parseInt(options.nsqdPort, 10));
  this._writer.connect();
}

util.inherits(Bus, events.EventEmitter);

/**
 * Publish event that video has been uploaded to S3 for recognition.
 *
 * @method     publishVideoUploaded
 * @param      {Object}    data    Video data object.
 * @param      {Function}  fn      Callback.
 */
Bus.prototype.publishVideoUploaded = function (data, fn) {
  this._writer.publish('video-recognitions', data, fn);
};

module.exports = Bus;
