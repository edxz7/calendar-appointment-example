const express = require('express');
const router = express.Router();
const Day = require('../models/Day.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const Appointment = require('../models/Calendar.model');
const isUser = require('../middleware/isUser');

// Esta ruta solo puede ser llamada por normal users
router.post('/create', isLoggedIn, isUser, async (req, res, next) => {
    console.log('req.body: ', req.body);
    const { _id: userId } = req.session.currentUser;
    // si el user ya tiene un calendario, lo actualizaremos
    const appointment = await Appointment.findOne({userId});
    let appointmentId =  calendar && calendar._id;

    // tu codigo aca

    res.redirect('/')
})

module.exports = router;
