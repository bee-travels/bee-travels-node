const path = require("path");

const streamableAxios = require("./streamableAxios");

const express = require("express");

const app = express();

const PORT = process.env.PORT || 9000;

const proxies = [
  {
    service: process.env.CURRENCY_EXCHANGE_URL || "http://localhost:9201",
    path: "/api/v1/currency*",
  },
  {
    service: process.env.HOTEL_URL || "http://localhost:9101",
    path: "/api/v1/hotels*",
  },
  {
    service: process.env.CAR_URL || "http://localhost:9102",
    path: "/api/v1/cars*",
  },
  {
    service: process.env.DESTINATION_URL || "http://localhost:9001",
    path: "/api/v1/destinations*",
  },
];

const proxyRequest = async (req, res, url) => {
  req
    .pipe(streamableAxios({ url: url }))
    .on("error", (e) => {
      console.error("error in streamable axios : ",e);
      res.sendStatus(500);
    })
    .pipe(res)
    .on("error", (e) => {
      console.error("error in result : ",e);
      res.sendStatus(500);
    });
};

proxies.forEach(({ service, path }) => {
  app.all(path, (req, res) => {
    const url = `${service}${req.originalUrl}`;
    console.log(url);
    proxyRequest(req, res, url);
  });
});

if (process.env.NODE_ENV === "production") {
  console.log("production build");

  app.use(express.static(path.join(__dirname, "client", "build")));

  // give all the routes to react
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log("listening on port " + PORT));
