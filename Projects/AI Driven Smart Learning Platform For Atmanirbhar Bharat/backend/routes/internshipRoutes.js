const express = require("express");
const router = express.Router();

const {
  getInternships,
  addInternship,
} = require("../controllers/internshipController");

router.get("/",getInternships);
router.post("/",addInternship);

module.exports = router;