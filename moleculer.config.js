"use strict";

module.exports = {
  namespace: "moleculer-test",
  logger: true,
  logLevel: "info",
  cacher: {
    type: "memory",
    options: {
      maxParamsLength: 100,
    },
  },
  metrics: false,

  tracing: {
    enabled: true,
    exporter: [
      {
        type: "Console",
        options: {
          width: 100,
          colors: true,
        },
      },
    ],
  },

  validator: true,
};
