const express = require('express');
const router = express.Router();
const Day = require('../models/Day.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const Appointment = require('../models/Appointment.model');
const isUser = require('../middleware/isUser');
const Calendar = require('../models/Calendar.model');

// Esta ruta solo puede ser llamada por normal users
router.post('/create/:calendarId', isLoggedIn, isUser, async (req, res, next) => {
    // Primero buscamos el calendario con el que hacemos la cita
    const { calendarId } = req.params;
    console.log('calendarId: ', calendarId);
    // Una vez que tenemos el calendario, le agregamos los appointments
    // echos por el usuario con id igual a userId
    console.log('req.body: ', req.body);
    const { _id: userId } = req.session.currentUser;

    const daysRequestedForAppointment = Object.keys(req.body);
    const calendar = await Calendar.findById(calendarId)
    .populate('userId')
    .populate({ 
        path: 'days',
        populate: {
            path: 'appointments',
            model: 'Appointment'
        }
    });
    console.log('calendar from appointment: ', calendar)
    // En el calendario debemos verificar que el horario solcitado para la cita (appointemnt) este disponible 
    for (const day of calendar.days) {
        // solo revisaremos los dias donde se solicito appointment
        if(daysRequestedForAppointment.includes(day.name)) {
            const dayId = day._id;
            // data sent in the req.body looks like: { 'Jueves': '16', 'Viernes': ['17', '19'] }
            const requestedBookedBlocks = typeof req.body[day.name] === 'string' ? [Number(req.body[day.name])] : req.body[day.name].map(Number)
            console.log('day selected to do the appointment: ', day.name);
            // y si las horas solicitadas estan dentro de los horarios disponibles
            console.log('day.openTimeBlocks: ', day.openTimeBlocks, 'requestedBookedBlocks: ', requestedBookedBlocks);
            if(contains(day.openTimeBlocks, requestedBookedBlocks)) {
                // revisamos que no haya colisión con otros appointments echos para el dia que estamos iterando (que no le pertenezcan al usuario)
                const scheduledBLocks = day.appointments.flatMap(a => {
                    // Esta condicion le esta permitiendo a un user hace cambios en sus appointments
                    if(a.userId !== userId)  // comentar esta linea si no queremos que el usuario pueda re-agendar sus propias citas
                        return a.scheduledBLocks
                }).filter(Boolean)
                console.log('scheduledBLocks: ', scheduledBLocks);
                const validAppointments = calculateAvailableBlocks(scheduledBLocks, requestedBookedBlocks);
                // we create an appointment wiht the validAppointments
                console.log('day: ', day.name ,'validAppointments', validAppointments);
                const createdAppointment = await Appointment.create({
                    date: new Date(),
                    userId, // id del user haciendo la cita
                    scheduledTimeBlocks: validAppointments,
                    dayId
                })
                const appointmentId = createdAppointment._id;
                console.log('dayId: ', dayId)
                console.log('createdAppointment._id: ', appointmentId);
                const updatedDay = await Day.findByIdAndUpdate(
                    dayId,
                    { $push: { appointments: appointmentId } },
                    { new: true }
                )
                console.log('updatedDay: ', updatedDay);
            }
        }
    }
    // /owner/${calendar.userId._id}/detail
    res.redirect(`/owner/${calendar.userId._id}/detail`)
})


function calculateAvailableBlocks(A, B) {
    return B.filter(item => !A.includes(item));
}

/**
 * contains tell us if the array B is contained in the array A
 * @param {*} A an array of numbers
 * @param {*} B an array of numbers
 * @returns 
 */
function contains(A, B) {
    return B.every(element => A.includes(element));
}
module.exports = router;
