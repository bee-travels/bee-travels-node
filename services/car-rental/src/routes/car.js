import { Router } from "express";
import { getCars, getInfo } from "../service/carService";

const router = Router();

router.get("/info/:topic", function (req, res) {
  getInfo(req.params.topic).then(function (data) {
    res.contentType("application/json");
    if (!data) {
      res.status(404).send('{"error": "not found"}');
      return;
    }

    res.send(data);
  });
});

router.get("/:city/:country", function (req, res) {
  let filter;
  let company = req.query.company;
  let car = req.query.car;
  let type = req.query.type;
  let style = req.query.style;
  let minCost = req.query.mincost;
  let maxCost = req.query.maxcost;

  if (company || car || type || style || minCost || maxCost) {
    filter = {};
    filter.company = company ? company.split(",") : [];
    filter.car = car ? car.split(",") : [];
    filter.type = type ? type.split(",") : [];
    filter.style = style ? style.split(",") : [];
    filter.minCost = parseInt(minCost) || 0;
    filter.maxCost = parseInt(maxCost) || Number.MAX_SAFE_INTEGER;
  }

  getCars(req.params.city, req.params.country, filter).then(function (data) {
    res.contentType("application/json");
    if (!data) {
      res.status(404).send('{"error": "not found"}');
      return;
    }
    res.send(data);
  });
});

export default router;
