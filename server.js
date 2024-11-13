const app = require("./app");
const http = require("http");

const server = http.createServer(app);

const PORT = process.env.SERVER_PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
