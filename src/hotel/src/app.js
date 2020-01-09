import createError from "http-errors";
import express from "express";
import logger from "morgan";
import yaml from "yamljs";
import { serve, setup } from "swagger-ui-express";

import hotelRouter from "./routes/hotel";

var swaggerDocument = yaml.load("swagger.yaml");
swaggerDocument.host = process.env.HOST_IP || "localhost:9002";
var scheme = process.env.SCHEME || "http";
swaggerDocument.schemes = [scheme];

var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

var api = "/api/v1";

app.use(api+"/hotels", hotelRouter);

app.use("/", serve, setup(swaggerDocument));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;