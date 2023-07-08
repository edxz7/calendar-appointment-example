const express = require('express');
const Calendar = require('../models/Calendar.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const Appointment = require('../models/Appointment.model');
const router = express.Router();
// step 2: If a user has a calendar, display it


/* GET home page */
router.get("/", isLoggedIn, isAdmin, async (req, res, next) => {

  res.render("index");
});

module.exports = router;
