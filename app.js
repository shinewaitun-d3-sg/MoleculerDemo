const UserService = require("./services/user.service");
const NotificationService = require("./services/notification.service");

const startApp = async () => {
  await UserService.broker
    .start()
    .then(() => {
      return UserService.broker
        .call("user.getUsers")
        .then((res) => UserService.broker.logger.info("Users count:", res.length));
    })
    .then(() => {
      return UserService.broker
        .call("user.getUsers")
        .then((res) =>
          UserService.broker.logger.info("Users count from cache:", res.length)
        );
    });
  await NotificationService.broker.start();
};

startApp();
