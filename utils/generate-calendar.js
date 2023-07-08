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

  module.exports = createCalendar;