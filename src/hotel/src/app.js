import createError from "http-errors";
import express from "express";
import logger from "morgan";

import hotelRouter from "./routes/hotel";


var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

var api = "/api/v1";

app.use(api+"/hotels", hotelRouter);


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