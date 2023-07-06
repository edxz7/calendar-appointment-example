const express = require('express');
const Calendar = require('../models/Calendar.model');
const router = express.Router();
// step 2: If a user has a calendar, display it


/* GET home page */
router.get("/", (req, res, next) => {
  // serve calendar
  const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
  const data = {
    rows: []
  };

  for (let i = 0; i < 24; i++) {
    let cols = []
    for (let j = 0; j < 7; j++) {
      cols.push({
        day: weekDays[j],
        hour: i
      })
    }
    data.rows.push({
      hour: i,
      cols
    })      
  }

  // console.log('data: ', data)
  res.render("calendar/calendar", { rows: data.rows });
});




module.exports = router;
