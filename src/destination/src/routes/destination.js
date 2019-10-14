/**
 * Router for destination locations
 */

import { Router } from "express";
import { join } from "path";
import { getDestinationData as _getDestinationData } from "../services/dataHandler";

var router = Router();
/* GET list of destination locations */
router.get("/", function (req, res, next) {

  var getDestinationData = _getDestinationData(null);

  getDestinationData.then(function (destinationData) {
    res.send(destinationData);
  }).catch(function (err) {
    res.sendStatus(500);
    next(err);
  });
});

/* GET location data for a given city */
router.get("/:city/:country", function (req, res, next) {

  var getDestinationData = _getDestinationData(req.params.city, req.params.country);

  getDestinationData.then(function (destinationData) {
    res.send(destinationData);
  }).catch(function (err) {
    res.sendStatus(500);
    next(err);
  });
});


router.get("/image", function (req, res, next) {
  console.log("image get called");
  var options = {
    root: join(__dirname, "../public/images"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };
  console.log(JSON.stringify(options));
  res.sendFile("Abadan.jpg", options, function (err) {
    if (err) {
      console.log("error happened");
      next(err);
    } else {
      console.log("sent");
    }
  });
});

export default router;