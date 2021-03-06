const express = require("express");
const router = express.Router({ strict: true });
const aws = require("../helpers/aws");
const db = require("../helpers/db");

// Display all the schools in the database in alphabetical order
router.get("/", async (req, res, next) => {
  let schools = await db.getAllSchools();
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
  console.log(info);
  const newSchool = await db.createSchool(info);
  console.log(newSchool);
  res.redirect(`/schools/${newSchool.id}`);
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

// PUT method called when user clickers "update"
router.post(
  "/:schoolID/update",
  aws.upload.single("img"),
  async (req, res, next) => {
    let info = req.body;
    console.log(req.file);
    if (req.file) {
      info.imagekey = req.file.key;
    }
    await db.updateSchool(req.params.schoolID, info);
    res.redirect(".");
  }
);

router.post("/:schoolID/delete", async (req, res, next) => {
  const deletedSchool = await db.deleteSchool(req.params.schoolID);
  console.log(deletedSchool);
  if (deletedSchool.imagekey) {
    aws.delete(deletedSchool.imagekey);
  }
  res.redirect("/schools");
});

module.exports = router;
