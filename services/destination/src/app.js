/**
 * Main app.js file for the destinations microservice
 */

import createError from "http-errors";
import express from "express";
import { serve, setup } from "swagger-ui-express";
import destinationRouter from "./routes/destination";
import yaml from "yamljs";

let swaggerDocument = yaml.load("swagger.yaml");
swaggerDocument.host = process.env.HOST_IP || "localhost:9001";
const scheme = process.env.SCHEME || "http";
swaggerDocument.schemes = [scheme];

const app = express();
const api = "/api/v1";

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(api + "/destinations", destinationRouter);

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
