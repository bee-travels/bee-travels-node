import { Router } from "express";

import client, { Counter, Summary } from "prom-client";

import timeResponse from "response-time";

const router = Router();

client.register.clear();
const numOfRequests = new Counter({
  name: "numOfRequests",
  help: "Number of requests made",
  labelNames: ["method"],
});

const pathsTaken = new Counter({
  name: "pathsTaken",
  help: "Paths taken in the app",
  labelNames: ["path"],
});

const responses = new Summary({
  name: "responses",
  help: "Response time in millis",
  labelNames: ["method", "path", "status"],
});

router.use((req, _, next) => {
  numOfRequests.inc({ method: req.method });
  pathsTaken.inc({ path: req.path });
  next();
});

router.use(
  timeResponse((req, res, time) => {
    responses.labels(req.method, req.url, res.statusCode).observe(time);
  })
);

export default router;
