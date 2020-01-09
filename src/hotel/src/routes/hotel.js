/**
 * Router for hotel
 */

import { getHotels, getInfo } from "../service/hotelService";
import { Router } from "express";

var router = Router();
/* GET list of destination locations */

router.get("/info/:topic", function (req, res) {
  var data = getInfo(req.params.topic);
  res.contentType("application/json");
  if (!data) {
    res.status(404).send("{\"error\": \"not found\"}");
    return;
  }

  res.send(data);
});

router.get("/:city/:country", function (req, res) {
  var filter;
  let superchain = req.query.superchain;
  let hotel = req.query.hotel;
  let type = req.query.type;
  let minCost = req.query.mincost;
  let maxCost = req.query.maxcost;

  if (superchain || hotel || type || minCost || maxCost) {
    filter = {};
    filter.superchain = superchain ? superchain.split(",") : [];
    filter.hotel = hotel ? hotel.split(",") : [];
    filter.type = type ? type.split(",") : [];
    filter.minCost = parseInt(minCost) || 0;
    filter.maxCost = parseInt(maxCost) || Number.MAX_SAFE_INTEGER;
  }

  var data = getHotels(req.params.city, req.params.country, filter);
  res.contentType("application/json");
  if (!data) {
    res.status(404).send("{\"error\": \"not found\"}");
    return;
  }

  res.send(data);
});



export default router;