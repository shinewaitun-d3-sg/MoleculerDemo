const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker({
  logger: console,
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
  errorHandler(err, info) {
    this.logger.warn("Log the error:", err);
    throw err;
  },
});

const generateId = () => {
  return Math.floor(Math.random() * 1000) + 1;
};

const users = [];

broker.createService({
  name: "user",
  actions: {
    createUser: {
      params: {
        username: { type: "string", min: 5 },
        email: { type: "string", min: 5 },
      },
      async handler(ctx) {
        const { username, email } = ctx.params;
        const newUser = { id: generateId(), username, email };
        users.push(newUser);
        return newUser;
      },
    },
    getUsers: {
      async handler(ctx) {
        return users;
      },
    },
  },
});

module.exports = { broker };
