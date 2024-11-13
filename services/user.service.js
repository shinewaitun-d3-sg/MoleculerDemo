const broker = require("../broker");

const generateId = () => {
  return Math.floor(Math.random() * 1000) + 1;
};

const users = [];

broker.createService({
  name: "user",
  actions: {
    createUser: {
      //Validator
      params: {
        username: { type: "string", min: 5 },
        email: { type: "string", min: 5 },
      },
      async handler(ctx) {
        const { username, email } = ctx.params;
        const newUser = { id: generateId(), username, email };
        users.push(newUser);
        //Without group
        broker.emit("user.created", newUser);
        //With group
        // broker.emit("user.created", newUser, ["notifications"]);
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
