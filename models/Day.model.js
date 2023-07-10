const { Schema, model } = require('mongoose');

const daySchema = new Schema(
    {
        name: {
            type: String,
            enum: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
        },
        date: Date,
        openTimeBlocks: [ Number ],
        appointments: [ {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        } ],
    },
    {
        timestamps: true
    }
)

const Day = model('Day', daySchema);


module.exports = Day;