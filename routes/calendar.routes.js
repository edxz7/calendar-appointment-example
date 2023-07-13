const express = require('express');
const router = express.Router();
const Day = require('../models/Day.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const Calendar = require('../models/Calendar.model');
const createCalendar = require('../utils/generate-calendar');
const isUser = require('../middleware/isUser');

// Esta ruta solo puede ser llamada por admins
router.post('/create', isLoggedIn, isAdmin, async (req, res, next) => {

    const { _id: userId } = req.session.currentUser;
    // si el Admin ya tiene un calendario, lo traemos para actualizarlo
    const calendar = await Calendar.findOne({userId}).populate({
        path: 'days'
    });
    // we store the old opened time blocks of each day in oldDays
    const oldDays = calendar.days
    console.log('oldDays: ', oldDays);
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
        // recuperamos las citas que teniamos en el viejo calendario
        const appointments = oldDays.filter(oldDay => oldDay.name === day)
        .flatMap(day => day.appointments)
        console.log('recovered appointments', appointments);
        const calendarDay = await Day.create({
            date: new Date(), //
            name: day,
            openTimeBlocks: req.body[day],
            appointments 
        }); 
        newDays.push(calendarDay._id);
    }
    // y agregamos los dias al calendario que le mostraremos a nuestro cliente
    // para que vea nuestra disponibilidad
    await Calendar.findByIdAndUpdate(
        calendarId, // buscamos el calendario asociado al user
        { $set: { days: newDays } }, // y le agregamos los dias creados
        { new: true }, 
    )

    console.log('req.body: ', req.body);
    res.redirect('/calendar')
})

/* GET calendar associated to an trainer/store/etc... */
router.get("/", isLoggedIn, isAdmin, async (req, res, next) => {
    const { _id: userId, role } = req.session.currentUser;
    let calendarData;
    // si el usuario logueado es un admin revisamos si ya tiene un calendario asociado
    calendarData = await Calendar.findOne({ userId })
    .populate('userId')
    .populate({
        path: 'days', 
        populate: { 
           path: 'appointments', 
           model: 'Appointment'
       }
   })
  
  
    // Generamos la información necesaria para crear un calendario
    // Si ya hay información asociada al calendario (contenida en calendarData), la función createCalendar la usuara para crear el calendario
    // si no hay información previa calendario, nos dara lo necesario para pintar un calendario vacio 
    // si queremos limitar el rango de horas a menos de 24, indicamos un "start" y un "end" hour
    const calendar = createCalendar(calendarData, 6, 20);
  
    console.log('calendar: ', calendar);

    // console.log('data: ', data)
    res.render("calendar/calendar", { rows: calendar.rows });
  });
  
  

  
  
  

module.exports = router;
