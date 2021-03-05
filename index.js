const express = require("express");
const http = require("http");

require("dotenv").config();

const port = process.env.PORT || 3000;

console.log(process.env);
function startServer() {
  const app = express();
  const server = http.createServer(app);

  // view engine setup
  app.set("views", "./views");
  app.set("view engine", "pug");
  app.set("trust proxy", 1);

  const index = require("./routes/index");

  app.use("/public", express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/", index);

  server.listen(port, function () {
    console.log("listening on *:" + port);
  });

  app.use(function err404(req, res, next) {
    res.status(404).render("404", { title: "Oops!" });
  });
}

startServer();
