// 2. routes/rides.js
const express = require("express");
const router = express.Router();
const { getRides } = require("../controllers/ridesController");
router.post("/", getRides);
module.exports = router;