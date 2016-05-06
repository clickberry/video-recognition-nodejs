var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');

var defaults = require('./routes/default');
var routes = require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// logger
if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger());
}

// body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static
app.use('/', express.static(path.join(__dirname, 'public')));

// routes
app.use('/', routes);

// error handlers
app.use(defaults.notfound);
app.use(defaults.error);

module.exports = app;
