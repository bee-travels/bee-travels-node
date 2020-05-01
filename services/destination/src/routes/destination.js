/**
 * Router for destination locations
 */

import path from "path";
import express, { Router } from "express";
import { getDestinationData } from "../services/dataHandler";

const router = Router();

router.use(
  "/images",
  express.static(path.join(__dirname, "../../public/images"))
);

/* GET location data for a given city */
router.get("/:city/:country", function (req, res, next) {
  const destinationData = getDestinationData(
    req.params.city,
    req.params.country
  );

  destinationData
    .then(function (data) {
      res.send(data);
    })
    .catch(function (err) {
      res.sendStatus(500);
      next(err);
    });
});

/* GET list of destination locations */
router.get("/", function (req, res, next) {
  const destinationData = getDestinationData(null);

  destinationData
    .then(function (data) {
      res.send(data);
    })
    .catch(function (err) {
      res.sendStatus(500);
      next(err);
    });
});

export default router;
