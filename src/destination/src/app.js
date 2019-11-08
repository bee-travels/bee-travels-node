/**
 * Main app.js file for the destinations microservice
 */

import createError from "http-errors";
import express from "express";
import logger from "morgan";
import cors from "cors";
import { serve, setup } from "swagger-ui-express";
import { join } from "path";
import destinationRouter from "./routes/destination";
import yaml from "yamljs";

var swaggerDocument = yaml.load("swagger.yaml");
swaggerDocument.host = process.env.HOST_IP || "localhost:4000";
var scheme = process.env.SCHEME || "http";
swaggerDocument.schemes = [scheme];


var app = express();
var api = "/api/v1";

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(api + "/destinations", destinationRouter);

app.use("/images", express.static(join(__dirname, "../public/images")));

app.use("/", serve, setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app;