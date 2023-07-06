const express = require('express');
const Calendar = require('../models/Calendar.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const Appointment = require('../models/Appointment.model');
const router = express.Router();
// step 2: If a user has a calendar, display it


/* GET home page */
router.get("/", isLoggedIn, isAdmin, async (req, res, next) => {

  console.log(req.session.currentUser)

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
  res.render("calendar/calendar", { rows: calendar.rows });
});


/**
 * createCalendar genera los slots para pintar un diagrama del calendario
 * si recibe informacion de un calendario o citas, lo indica en el campo isOpen and isBooked
 * @param {*} startHour 
 * @param {*} endHour 
 * @returns 
 */
function createCalendar(calendarData, startHour = 0, endHour = 24) {
  const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
  const data = {
    rows: []
  };
  /**
   * la infromacion de calendarData luce asi:
   * [
   *   {
   *     name: 'Lunes',
   *     openTimeBlocks: [ 4, 5 ],
   *     scheduledTimeBlocks: [ 5 ] 
   *   },
    *   {
   *     name: 'Martes',
   *     openTimeBlocks: [ 4, 5 ],
   *     scheduledTimeBlocks: [ 5 ] 
   *   },
   * ]
   * 
   * cuando no esta vacia
   */

  console.log('calendarData: ', calendarData);

  //
  for (let i = startHour; i < endHour; i++) {
    
    let cols = []
    for (let j = 0; j < weekDays.length; j++) {
      const [dayOpenedOrScheduled] = calendarData
      && calendarData.days.filter(d => d.name === weekDays[j])
      const isOpen = dayOpenedOrScheduled && dayOpenedOrScheduled.openTimeBlocks.includes(i)
      const isBooked = dayOpenedOrScheduled && dayOpenedOrScheduled.scheduledTimeBlocks.includes(i)
      cols.push({
        // revisamos si ya estaba abierto ese horario o si ya habia una reservacion 
        isOpen,
        isBooked,
        day: weekDays[j],
        hour: i
      })
    }
    data.rows.push({
      hour: i, // guardamos aca tambien las horas para mostralas en el formulario (las horas que se guardan aca son las que aparecen en el formulario)
      cols
    })      
  }
  return data;
}



module.exports = router;
