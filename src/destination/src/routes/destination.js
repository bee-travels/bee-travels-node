/**
 * Router for destination locations
 */

import { Router } from "express";
import { getDestinationData } from "../services/dataHandler";

var router = Router();
/* GET list of destination locations */
router.get("/", function (req, res, next) {

  var destinationData = getDestinationData(null);

  destinationData.then(function (data) {
    res.send(data);
  }).catch(function (err) {
    res.sendStatus(500);
    next(err);
  });
});

/* GET location data for a given city */
router.get("/:city/:country", function (req, res, next) {

  var destinationData = getDestinationData(req.params.city, req.params.country);

  destinationData.then(function (data) {
    res.send(data);
  }).catch(function (err) {
    res.sendStatus(500);
    next(err);
  });
});

export default router;