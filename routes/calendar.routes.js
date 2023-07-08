const express = require('express');
const Calendar = require('../models/Calendar.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const Day = require('../models/Day.model');
const createCalendar = require('../utils/generate-calendar');
const router = express.Router();

// render de calendar in the form

/* GET home page */
router.get("/", isLoggedIn, isAdmin, async (req, res, next) => {

    console.log('user in session: ',req.session.currentUser)
  
    const { _id: userId, role } = req.session.currentUser;
    let calendarData;
    // si el usuario logueado es un admin revisamos si ya tiene un calendario asociado
    if(role === 'Admin') {
      calendarData = await Calendar.findOne({ userId })
      .populate('userId')
      .populate({
       path: 'days'
      })
    } else {
      // si el usuario es normal, vemos si ya hice appointments 
      appointmentData = await Appointment.findOne({ userId })
      .populate('userId')
      .populate({
       path: 'calendarId'
      })
      if(appointmentData) {
        // en el campo calendar esta el calendario en donde hizo los appointments
        calendarData = appointmentData.calendar;
      } else {
        // si no tiene appointments necesitamos el calendario de un Admin
        // aca hay dos formas de hacerlo
        // en el modelo de la peluqueria de mascotas, si solo hay una tienda
        // solo hay un calendario, asi que podemos hacer lo siguiente:
  
        // calendarData = await Calendar.find()
        // .populate({
        //  path: 'days'
        // })[0]
  
        // porque solo hay un calendario
  
        // para el caso de multiples Admins (entrenadores) debemos tener una vista previa
        // donde seleccionar al entrenador y de ahi guardar el id de entrenador (que sería el userId)
        // una vez que tengamos esa info repetimos justo abajo de este comment el codigo
        // de la linea 26 a la 30 de este file
      }
    }
  
    // console.log('calendarData: ', calendarData);
  
  
    // Generamos la información necesaria para crear un calendario
    // Si ya hay información asociada al calendario (contenida en calendarData), la función createCalendar la usuara para crear el calendario
    // si no hay información previa calendario, nos dara lo necesario para pintar un calendario vacio 
    // si queremos limitar el rango de horas a menos de 24, indicamos un "start" y un "end" hour
    const calendar = createCalendar(calendarData, 6, 20);
  
  
    // console.log('data: ', data)
    res.render("partials/calendar", { rows: calendar.rows });
  });
  
  

  

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
