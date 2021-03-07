const express = require("express");
const router = express.Router({ strict: true });
const aws = require("../helpers/aws");
const db = require("../helpers/db");

// Display all the schools in the database in alphabetical order
// If a search query is added, then
router.get("/", async (req, res, next) => {
  let schools;
  if (req.query.q) {
    schools = await db.getSchoolByName(req.query.q);
  } else {
    schools = await db.getAllSchools();
  }
  // sorts schools in alpha order
  schools.sort((a, b) => {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  });
  res.render("schools", { title: "School Listing", schools: schools });
});

// Page to create a new school listing
router.get("/create", (req, res, next) => {
  res.render("create", {
    title: "Create Listing",
    type: "create",
    school: { name: "", location: "", admissions: "", about: "" },
  });
});

// POST method called when user clicks "create"
router.post("/create", aws.upload.single("img"), async (req, res, next) => {
  let info = req.body;
  if (req.file) {
    info.imagekey = req.file.key;
  }
  const newSchool = await db.createSchool(info);
  res.redirect(`/schools`);
});

router.get("/:schoolID", async (req, res, next) => {
  res.redirect(`./${req.params.schoolID}/`);
});

// View a specific school's information
router.get("/:schoolID/", async (req, res, next) => {
  const queryResponse = await db.getSchoolByID(req.params.schoolID);
  if (queryResponse.length == 0) {
    next();
  } else {
    res.render("view", {
      title: queryResponse[0].name,
      school: queryResponse[0],
    });
  }
});

// Page to update information
router.get("/:schoolID/update", async (req, res, next) => {
  const queryResponse = await db.getSchoolByID(req.params.schoolID);
  if (queryResponse.length == 0) {
    next();
  } else {
    res.render("create", {
      title: "Update" + queryResponse[0].name,
      school: queryResponse[0],
      type: "update",
    });
  }
});

// called when user clickers "update"
router.post(
  "/:schoolID/update",
  aws.upload.single("img"),
  async (req, res, next) => {
    let info = req.body;

    // If a new file is given, delete previous image from database
    if (req.file) {
      oldSchool = await db.getSchoolByID(req.params.schoolID);
      console.log(JSON.stringify(oldSchool));
      aws.delete(oldSchool[0].imagekey);
      info.imagekey = req.file.key;
    }
    await db.updateSchool(req.params.schoolID, info);
    res.redirect(".");
  }
);

// Delete school and image from database and S3
router.post("/:schoolID/delete", async (req, res, next) => {
  const deletedSchool = await db.deleteSchool(req.params.schoolID);
  if (deletedSchool.imagekey) {
    aws.delete(deletedSchool.imagekey);
  }
  res.redirect("/schools");
});

module.exports = router;
