const { Schema, model } = require('mongoose');


const calendarSchema = new Schema(
    {
        date: Date,
        userId: {
            type: Schema.Types.ObjectId,
            red: 'User' 
        },
        appointments: [{
            type: Schema.Types.ObjectId,
            red: 'Appointment'             
        }],
        days: [{
            type: Schema.Types.ObjectId,
            red: 'Day'             
        }],
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`    
      timestamps: true
    }
)

const Calendar = model("Calendar", calendarSchema);

module.exports = Calendar;