/**
 * Router for destination locations
 */

import { Router } from "express";
import { getDestinationData } from "../services/dataHandler";
import request from "request";

const router = Router();

router.get("/images/*", (req, res) => {
  request({
    url: `http://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-destination/${req.params[0]}`,
  })
    .pipe(res)
    .on("error", (e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

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
