const express = require("express");
const router = express.Router();

// Home page displaying all the schools in the database
router.get("/", (req, res, next) => {
  res.render("home", { title: "Quilt" });
});

// About page
router.get("/about", (req, res, next) => {
  res.render("about", { title: "About" });
});
module.exports = router;
