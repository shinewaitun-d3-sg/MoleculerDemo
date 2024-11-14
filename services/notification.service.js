const { ServiceBroker } = require("moleculer");
const broker = new ServiceBroker();

broker.createService({
  name: "notification",
  events: {
    //Without group
    // "user.created"(payload) {
    //   console.log("New user created. Sending notification:", payload);
    // },
    //With group
    "user.created": {
      group: "notifications",
      handler(payload) {
        console.log(payload);
      },
    },
    "user.updated": {
      group: "notifications",
      handler(payload) {
        console.log(payload);
      },
    },
    "user.deleted": {
      group: "notifications",
      handler(payload) {
        console.log(payload);
      },
    },
  },
});

module.exports = { broker };
