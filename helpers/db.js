/* 

This helper file contains all the necessary database querying functions.

*/

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
});

// Retrieves all schools currently in the database. Returns the query response as an object.
async function getAllSchools() {
  try {
    const schools = await pool.query("SELECT * FROM schools");
    return schools.rows;
  } catch (error) {
    console.error(error);
  }
}

// Get school information by ID. Returns the query response as an object.
async function getSchoolByID(id) {
  try {
    const schools = await pool.query("SELECT * FROM schools WHERE ID=$1", [id]);
    return schools.rows;
  } catch (error) {
    console.error(error);
  }
}

// Search school information by ID. Returns the query response as an object.
async function getSchoolByName(searchQuery) {
  try {
    const schools = await pool.query(
      "SELECT * FROM schools WHERE name LIKE '%$1%'",
      [searchQuery]
    );
    return schools.rows;
  } catch (error) {
    console.error(error);
  }
}

// Creates a school and inserts into the database.
async function createSchool(info) {
  try {
    const newSchool = await pool.query(
      "INSERT INTO schools(name, about, location, admissions) VALUES($1, $2, $3, $4) RETURNING *",
      [info.name, info.about, info.location, info.admissions]
    );
    return newSchool.rows[0];
  } catch (error) {
    console.error(error);
  }
}

// Updates a school's information
async function updateSchool(info) {
  try {
    const newSchool = await pool.query(
      "INSERT INTO schools(name, about, location, admissions) VALUES($1, $2, $3, $4) RETURNING *",
      []
    );
    return newSchool.rows[0];
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  pool: pool,
  getAllSchools: getAllSchools,
  getSchoolByID: getSchoolByID,
  getSchoolByName: getSchoolByName,
  createSchool: createSchool,
  updateSchool: updateSchool,
};
