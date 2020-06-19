const path = require("path");

const axios = require("axios");
const openapi = require("openapi-comment-parser");
const openapiUI = require("openapi-ui-express");
const express = require("express");

const router = express.Router();

function docCollector(proxies) {
  const baseSpec = openapi({
    cwd: path.join(__dirname),
  });

  const specsPromises = proxies.map(({ service }) => {
    // TODO: This needs to run after all the other services are ready.
    return axios
      .get(`${service}/spec`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return {};
      });
  });

  Promise.all(specsPromises).then((specs) => {
    function specMerge(baseSpec, specs) {
      return specs.reduce((acc, item) => {
        // None of our service paths should overlap so this should be fine.
        if (item.paths) {
          acc.paths = { ...acc.paths, ...item.paths };
        }

        if (item.components) {
          const validComponents = [
            "schemas",
            "responses",
            "parameters",
            "examples",
            "requestBodies",
            "headers",
            "securitySchemes",
            "links",
            "callbacks",
          ];
          validComponents.forEach((key) => {
            // NOTE: Could have key collisions if schemas have the same name.
            if (item.components[key]) {
              acc.components[key] = {
                ...acc.components[key],
                ...item.components[key],
              };
            }
          });
        }

        return acc;
      }, baseSpec);
    }

    const mergedSpec = specMerge(baseSpec, specs);

    router.use(
      "/v1/api-docs",
      openapiUI(mergedSpec, { logo: path.join(__dirname, "logo.svg") })
    );
  });

  return router;
}

module.exports = docCollector;
