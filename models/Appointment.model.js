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
        scheduledTimeBlocks: [ Number ],
        cancelledTimeBlocks: [ Number ],
        // un appointment solo estar asociado a un solo dia, un dia puede tener muchos appointments
        dayId: {
            type: Schema.Types.ObjectId,
            ref: 'Day'
        }
    }
)


const Appointment = model('Appointment', appointmentSchema);

module.exports = Appointment;