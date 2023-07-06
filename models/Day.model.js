const { Schema, model } = require('mongoose');

const daySchema = new Schema(
    {
        name: {
            type: String,
            enum: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
        },
        date: Date,
        openTimeBlocks: [ Number ],
        scheduledTimeBlocks: [ Number ],
        cancelledTimeBlocks: [ Number ]
    },
    {
        timestamps: true
    }
)

const Day = model('Day', daySchema);


module.exports = Day;