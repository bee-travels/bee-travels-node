const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const request = require("request");

const DESTINATION_URL = process.env.DESTINATION_URL || "http://localhost:4000";
const MAPBOX_TOKEN = "pk.eyJ1IjoibW9maWNvZGVzIiwiYSI6ImNrMmUzc2F0MTA1ZmozbnMxNjg2bHM3ZTQifQ.KVVT-kSwP1bZP3TroAAPCw";


app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors());

app.get("/images/:location", (req, res) => {
  res.set('Content-Type', 'image/jpg');
  request.get(DESTINATION_URL + '/images/'+req.params.location).pipe(res);
});

app.get("/api/v1/destinations", (req, res) => {
  request.get(DESTINATION_URL + '/api/v1/destinations').pipe(res);
})

app.get("/api/v1/destinations/:city/:country", (req, res) => {
  const url = DESTINATION_URL + "/api/v1/destinations/" + req.params.city + "/" + req.params.country;
  request.get(url).pipe(res);
});

app.get("/mapbox/key", (req, res) => {
  res.set('Content-Type', 'application/json')
  res.send({"key": MAPBOX_TOKEN});
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);

console.log("listening on port " + port);