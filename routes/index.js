const express = require("express");
const router = express.Router();
const db = require("../helpers/db");

// Home page displaying all the schools in the database
router.get("/", async (req, res, next) => {
  res.render("index", { title: "Quilt", schools: await db.getAllSchools() });
});

// Page to create a new school listing
router.get("/create", (req, res, next) => {
  res.render("create");
});

// POST method called when user clicks "create"
router.post("/create", (req, res, next) => {
  console.log(req.body);
  // db.createSchool(req.body)
  res.end();
});

// PUT method called when user clickers "update"
router.put("/update", (req, res, next) => {
  // TODO
});

router.get("/test", (req, res, next) => {
  res.render("test");
});

router.post("/test", (req, res, next) => {
  db.createSchool();
});
module.exports = router;
