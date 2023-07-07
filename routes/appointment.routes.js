const express = require('express');
const router = express.Router();
const Day = require('../models/Day.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const Appointment = require('../models/Calendar.model');

// Esta ruta solo puede ser llamada por noraml users
router.post('/create', isLoggedIn, isAdmin, async (req, res, next) => {
    console.log('req.body: ', req.body);
    const { _id: userId } = req.session.currentUser;
    // si el Admin ya tiene un calendario, lo actualizaremos
    const appointment = await Appointment.findOne({userId});
    let appointmentId =  calendar && calendar._id;

    // tu codigo aca

    res.redirect('/')
})

module.exports = router;
