const { Schema, model } = require('mongoose');

const appointmentSchema = new Schema(
    {
        date: Date,
        // el userId para appointments es solo para usuarios normales
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User' 
        },
        blockTimeUnit: {
            type: String,
            default: '60'
        },
        calendar: {
            type: Schema.Types.ObjectId,
            ref: 'Calendar' 
        },
    }
)


const Appointment = model('Appointment', appointmentSchema);

module.exports = Appointment;