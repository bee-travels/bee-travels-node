const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const request = require("request");

const DESTINATION_URL = process.env.DESTINATION_URL || "http://localhost:9001";
const HOTEL_URL = process.env.HOTEL_URL || "http://localhost:9101";
const CURRENCY_EXCHANGE_URL =
  process.env.CURRENCY_EXCHANGE_URL || "http://localhost:9201";

app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors());

app.get("/images/:location", (req, res) => {
  res.set("Content-Type", "image/jpg");
  request.get(DESTINATION_URL + "/images/" + req.params.location).pipe(res);
});

app.get("/api/v1/destinations", (req, res) => {
  request.get(DESTINATION_URL + "/api/v1/destinations").pipe(res);
});

app.get("/api/v1/destinations/:city/:country", (req, res) => {
  const url =
    DESTINATION_URL +
    "/api/v1/destinations/" +
    req.params.city +
    "/" +
    req.params.country;
  request.get(url).pipe(res);
});

app.get("/api/v1/hotels/:city/:country", (req, res) => {
  const superchain = req.query.superchain || "";
  const hotel = req.query.hotel || "";
  const type = req.query.type || "";
  const mincost = req.query.mincost || "";
  const maxcost = req.query.maxcost || "";
  const queryString = `?superchain=${superchain}&hotel=${hotel}&type=${type}&mincost=${mincost}&maxcost=${maxcost}`;
  const url =
    HOTEL_URL +
    "/api/v1/hotels/" +
    req.params.city +
    "/" +
    req.params.country +
    queryString;
  request.get(url).pipe(res);
});

app.get("/api/v1/hotels/info/:topic", (req, res) => {
  const url = HOTEL_URL + "/api/v1/hotels/info/" + req.params.topic;
  request.get(url).pipe(res);
});

app.get("/api/v1/currency", (req, res) => {
  request.get(CURRENCY_EXCHANGE_URL + "/api/v1/currency").pipe(res);
});

app.get("/api/v1/currency/:amount/:from/:to", (req, res) => {
  const url =
    CURRENCY_EXCHANGE_URL +
    "/api/v1/currency/" +
    req.params.amount +
    "/" +
    req.params.from +
    "/" +
    req.params.to;
  request.get(url).pipe(res);
});

app.post("/api/v1/currency/search", (req, res) => {
  request.post(CURRENCY_EXCHANGE_URL + "/api/v1/currency/search").pipe(res);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 9000;
app.listen(port);

console.log("listening on port " + port);
