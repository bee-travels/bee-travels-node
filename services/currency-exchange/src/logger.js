import logger from "pino-http";
import pinoPretty from "pino-pretty";

const pino = logger({
  level: process.env.LOG_LEVEL || "warn",
  prettyPrint:
    process.env.NODE_ENV !== "production" || process.env.LOG_LEVEL === "debug",
  // Yarn 2 doesn't like pino importing `pino-pretty` on it's own, so we need to
  // provide it.
  prettifier: pinoPretty,
  customLogLevel: function (res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    } else if (res.statusCode >= 500 || err) {
      return "error";
    }
    return "info";
  },
  customSuccessMessage: function (res) {
    if (res.statusCode === 404) {
      return "resource not found";
    }
    return "request completed";
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
    }),
  },
});

export default pino;
