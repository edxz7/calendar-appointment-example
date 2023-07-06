const { Schema, model } = require('mongoose');

const appointmentSchema = new Schema(
    {
        date: Date,
        blockTimeUnit: {
            type: String,
            default: '60'
        },
        scheduledTime: [{
            type: Number,
            validate : {
                validator : Number.isInteger,
                message   : '{VALUE} is not an integer value'
              }
        }]
    }
)


const Appointment = model('Appointment', appointmentSchema);

module.exports = Appointment;