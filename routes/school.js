const express = require("express");
const router = express.Router();
const db = require("../helpers/db");

// View school information
router.get("/:schoolID", async (req, res, next) => {
  const queryResponse = await db.getSchoolByID(req.params.schoolID);
  if (queryResponse.length == 0) {
    next();
  } else {
    res.render("view", { school: queryResponse[0] });
  }
});

// POST method called when user clicks "create"
router.post("/create", (req, res, next) => {
  console.log(req.body);
  // db.createSchool(req.body)
  res.end();
});

// Page to update information
router.get("/:schoolID/update", async (req, res, next) => {
  res.render("update");
});

// PUT method called when user clickers "update"
router.put("/:schoolID/update", (req, res, next) => {
  // TODO
});

module.exports = router;
