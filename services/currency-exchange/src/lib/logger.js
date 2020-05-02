const pino = require("pino");

module.exports = pino({
  level: process.env.LOG_LEVEL || "warn",
  prettyPrint: process.env.NODE_ENV !== "production",
});
