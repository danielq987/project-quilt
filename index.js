/*

Entry point of app. Some boilerplate is taken from 

*/
const express = require("express");
const http = require("http");
const cors = require("cors");

require("dotenv").config();

// port setup
const port = process.env.PORT || 3000;

function startServer() {
  const app = express();
  const server = http.createServer(app);

  // view engine setup
  app.set("views", "./views");
  app.set("view engine", "pug");
  app.set("trust proxy", 1);

  const index = require("./routes/index");
  const schools = require("./routes/school");

  // express config
  app.use("/public", express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use("/", index);
  app.use("/schools", schools);

  server.listen(port, () => {
    console.log("listening on *:" + port);
  });

  // 404 handling
  app.use((req, res, next) => {
    res.status(404).render("404", { title: "Oops!" });
  });
}

startServer();
