const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker({
  logger: console,
  //Middleware
  middlewares: [
    {
      localAction(next, action) {
        return async (ctx) => {
          console.log(
            `Action '${action.name}' was called with params:`,
            ctx.params
          );
          return next(ctx);
        };
      },
    },
  ],
  //Error Handling
  errorHandler(err, info) {
    this.logger.warn("Log the error:", err);
    throw err;
  },
});

module.exports = broker;
