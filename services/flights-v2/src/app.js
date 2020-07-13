import os from "os";

import express from "express";
import logger from "pino-http";
import pinoPretty from "pino-pretty";
import openapi from "openapi-comment-parser";
import swaggerUi from "swagger-ui-express";
import client from "prom-client";
import axios from "axios";

import flightsRouter from "./routes/flights";
import prometheus from "./prometheus";
import health from "./health";
import services from "./external-services";

const app = express();
// Setup Pino.
app.use(
  logger({
    level: process.env.LOG_LEVEL || "warn",
    prettyPrint: process.env.NODE_ENV !== "production",
    // Yarn 2 doesn't like pino importing `pino-pretty` on it's own, so we need to
    // provide it.
    prettifier: pinoPretty,
  })
);

// Prometheus metrics collected for all service api endpoints
app.use("/api", prometheus);
app.get("/metrics", (_, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(client.register.metrics());
});

app.use(health);

// Body parsing.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup Swagger.
// Don't use `/` for swagger, it will catch everything.
const spec = openapi({ cwd: __dirname });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.get("/info", (req, res) => {
  const infoPromises = Object.values(services).map((service) => {
    return axios
      .get(`${service}/info`)
      .then((res) => res.data)
      .catch(() => {});
  });

  Promise.all(infoPromises).then((infoArray) => {
    res.json({
      service: "flights-v2",
      hostname: os.hostname(),
      database: process.env.FLIGHTS_DATABASE,
      children: infoArray,
      language: "Node.js",
      url: process.env.FLIGHTS_URL || "http://localhost:9103",
    });
  });
});

// flights api.
app.use("/api/v1/flights", flightsRouter);

// Catch 404s.
app.use((_, res) => {
  res.sendStatus(404);
});

// Catch any other error.
// If we don't have 4 arguments express will callback with (req, res, next)
// Notice the lack of `err`
app.use((err, req, res, _) => {
  req.log.error(err);

  // Return only the status in production.
  if (process.env.NODE_ENV === "production") {
    return res.sendStatus(err.status || 500);
  }

  return res.status(err.status || 500).json({ error: err.message });
});

export default app;
