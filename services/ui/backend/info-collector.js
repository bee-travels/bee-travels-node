const os = require("os");
const axios = require("axios");
const express = require("express");

const router = express.Router();

// TODO: make a map of all the paths being checked
// if there is a duplicate do not rerun the axios get

function infoCollector(proxies) {
  router.get("/info", (_, res) => {
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
      res.json({ service: "ui", hostname: os.hostname(), children: info });
    });
  });

  return router;
}

module.exports = infoCollector;
