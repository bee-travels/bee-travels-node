const os = require("os");
const axios = require("axios");
const express = require("express");

const router = express.Router();

function infoCollector(proxies) {
  const infoPromises = proxies.map(({ service }) => {
    // TODO: This needs to run after all the other services are ready.
    return axios
      .get(`${service}/info`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return {};
      });
  });

  Promise.all(infoPromises).then((info) => {
    console.log(JSON.stringify(info, null, 2));
    router.get("/info", (_, res) => {
      res.json({ service: "ui", hostname: os.hostname(), children: info });
    });
  });

  return router;
}

module.exports = infoCollector;
