const broker = require("../broker");

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
        console.log("Notification for group notifications:", payload);
      },
    },
  },
});

module.exports = { broker };
