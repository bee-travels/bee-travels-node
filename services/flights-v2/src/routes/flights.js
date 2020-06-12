import { Router } from "express";
import { getData } from "../services/dataHandler";
import ExampleError from "../errors/ExampleError";

const router = Router();

/**
 * GET /api/v1/flights
 * @description Example route
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/", async (req, res, next) => {
  try {
    const data = await getData();
    return res.json(data);
  } catch (e) {
    if (e instanceof ExampleError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

export default router;
