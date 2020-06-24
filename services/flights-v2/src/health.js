import { Router } from "express";
import { readinessCheck } from "./services/dataHandler";

const router = Router();

/**
 * GET /live
 * @description Liveness check to make sure service is available
 * @response 200 - OK
 */
router.get("/live", (req, res) => res.sendStatus(200));

/**
 * GET /ready
 * @description Readiness check to make sure service and all connected external service calls are available
 * @response 200 - OK
 * @response 503 - Service Unavailable
 */
router.get("/ready", async (req, res, next) => {
  const isHealthy = await readinessCheck();
  if (isHealthy) {
    return res.sendStatus(200);
  }
  return res.status(503).send("Service Unavailable");
});

export default router;
