const { Schema, model } = require('mongoose');


const calendarSchema = new Schema(
    {
        date: Date,
        // el userId para calendarios es solo para usuarios Admin
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User' 
        },
        appointments: [{
            type: Schema.Types.ObjectId,
            ref: 'Appointment'             
        }],
        days: [
            {
              type: Schema.Types.ObjectId,
              ref: 'Day',
            },
        ],
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`    
      timestamps: true
    }
)

const Calendar = model("Calendar", calendarSchema);

module.exports = Calendar;