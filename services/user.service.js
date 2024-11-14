const { ServiceBroker } = require("moleculer");
const ApiGateway = require("moleculer-web");
const winston = require("winston");
const path = require("path");

const broker = new ServiceBroker({
  //Logging
  logger: {
    type: "Winston",
    options: {
      level: "info",
      winston: {
        transports: [
          new winston.transports.File({
            filename: path.join(__dirname, "../logs", "moleculer.log"),
          }),
        ],
      },
    },
  },
  //Caching
  cacher: {
    type: "Redis",
    options: {
      prefix: "MOL",
      ttl: 300,
      redis: {
        host: "127.0.0.1",
        port: 6379,
        db: 0,
      },
    },
  },
  //Middleware
  middlewares: [
    {
      localAction(next, action) {
        return async (ctx) => {
          this.logger.info(
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

const generateId = () => {
  return Math.floor(Math.random() * 1000) + 1;
};

const users = [];

broker.createService({
  name: "user",
  actions: {
    createUser: {
      // Validator
      params: {
        username: { type: "string", min: 5 },
        email: { type: "string", min: 5 },
      },
      async handler(ctx) {
        const { username, email } = ctx.params;
        const newUser = { id: generateId(), username, email };
        users.push(newUser);
        broker.broadcast("user.created", newUser, ["notifications"]);
        return newUser;
      },
    },
    updateUser: {
      params: {
        id: { type: "number" },
        username: { type: "string", min: 5 },
        email: { type: "string", min: 5 },
      },
      async handler(ctx) {
        const { id, username, email } = ctx.params;
        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) throw new Error("User not found");

        users[userIndex] = { id, username, email };
        broker.broadcast("user.updated", users[userIndex], ["notifications"]);
        return users[userIndex];
      },
    },
    getUsers: {
      cache: true,
      async handler(ctx) {
        return users;
      },
    },
    removeUser: {
      params: {
        id: { type: "number" },
      },
      async handler(ctx) {
        const { id } = ctx.params;
        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) throw new Error("User not found");

        const [removedUser] = users.splice(userIndex, 1);
        broker.broadcast("user.removed", removedUser, ["notifications"]);
        return removedUser;
      },
    },
  },
});

broker.createService({
  mixins: [ApiGateway],
  settings: {
    port: 2000,
    routes: [
      {
        path: "/user",
        aliases: {
          "POST /create": "user.createUser",
          "PUT /update": "user.updateUser",
          "GET /": "user.getUsers",
          "DELETE /remove": "user.removeUser",
        },
      },
    ],
  },
});

module.exports = { broker };
