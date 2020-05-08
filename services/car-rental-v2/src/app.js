import express from "express";
import logger from "pino-http";
import pinoPretty from "pino-pretty";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import options from "./swaggerConfig";

import carsRouter from "./routes/cars";

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

// Body parsing.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup Swagger.
// Don't use `/` for swagger, it will catch everything.
options.swaggerDefinition.host = process.env.HOST_IP || "localhost:9102";
options.swaggerDefinition.schemes = [process.env.SCHEME || "http"];
const specs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Currency api.
app.use("/api/v1/cars", carsRouter);

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
