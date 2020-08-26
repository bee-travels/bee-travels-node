const stream = require("stream");
const util = require("util");
const axios = require("axios");

function AxiosStream(options) {
  const self = this;
  self.options = options;
  stream.Stream.call(self);
  self.init();
}

util.inherits(AxiosStream, stream.Stream);

AxiosStream.prototype.init = function () {
  const self = this;
  if (self._started) {
    self.emit("error", new Error("Already started."));
  }
  self.on("pipe", (src) => {
    delete src.headers["host"];
    self.options = {
      headers: src.headers,
      method: src.method,
      ...self.options,
    };
  });
};

AxiosStream.prototype.start = function () {
  const self = this;
  self._started = true;
};

AxiosStream.prototype.end = function () {
  const self = this;
  if (!self._started) {
    self.start();
  }
  if (self._started) {
    axios({ ...self.options, responseType: "stream" })
      .then((stream) => {
        stream.data.on("data", (chunk) => {
          self.emit("data", chunk);
        });
        stream.data.on("end", () => {
          self.emit("end");
        });
      })
      .catch((e) => {
        self.emit("error", e);
      });
  }
};

const streamableAxios = (options) => new AxiosStream(options);

module.exports = streamableAxios;
