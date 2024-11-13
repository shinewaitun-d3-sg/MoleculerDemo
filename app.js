require("dotenv").config();
const express = require("express");
const cors = require("cors");
const UserService = require("./services/user.service");
const NotificationService = require("./services/notification.service");

const app = express();
app.use(express.json());
app.use(cors());

const startApp = async () => {
  await UserService.broker.start();
  await NotificationService.broker.start();
  try {
    const newUser = await UserService.broker.call("user.createUser", {
      username: "Johnny",
      email: "john@gmail.com",
    });
    console.log("New user created : ", newUser);
    const users = await UserService.broker.call("user.getUsers");
    console.log("Users : ", users);
  } catch (error) {
    console.log(error);
  } finally {
    UserService.broker.stop();
  }
};

startApp();

module.exports = app;
