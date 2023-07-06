const express = require('express');
const router = express.Router();
const Day = require('../models/Day.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const Calendar = require('../models/Calendar.model');

// Esta ruta solo puede ser llamada por admins
router.post('/create', isLoggedIn, isAdmin, async (req, res, next) => {

    const { _id: userId } = req.session.currentUser;
    // si el Admin ya tiene un calendario, lo traemos para actualizarlo
    const calendar = await Calendar.findOne({userId});
    let calendarId =  calendar && calendar._id;
    if(!calendarId) {
        // si no tenia, creamos un nuevo calendario
        const newCalendar = await Calendar.create({
            date: new Date(),
            userId,
        })
        calendarId = newCalendar._id;
    }
    // en este array vamos a guardar los ids de los dias seleccionados en el form
    const newDays = [];
    for (const day of Object.keys(req.body)) {
        const calendarDay = await Day.create({
            date: new Date(), //
            name: day,
            openTimeBlocks: req.body[day]
        }); 
        newDays.push(calendarDay._id);
    }
    // y agregamos los dias al calendario que le mostraremos a nuestro cliente
    // para que vea nuestra disponibilidad
    await Calendar.findByIdAndUpdate(
        calendarId, // buscamos el calendario asociado al user
        { $set: { days: newDays } }, // y le agregamos los dias creados
        { new: true } 
    )

    console.log('req.body: ', req.body);
    res.redirect('/')
})

module.exports = router;
