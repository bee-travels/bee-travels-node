/**
 * Main app.js file for the destinations microservice
 */

var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');
var YAML = require('yamljs');
var swaggerDocument = YAML.load('swagger.yaml');
swaggerDocument.host = process.env.HOST_IP || "localhost:3000";
var scheme = process.env.SCHEME || "http";
swaggerDocument.schemes = [scheme];

var destinationRouter = require('./routes/destination');

var app = express();
var api = "/api/v1";

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(api + '/destinations', destinationRouter);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
