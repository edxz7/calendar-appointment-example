  /**
   * createCalendar genera los slots para pintar un diagrama del calendario
   * si recibe informacion de un calendario o citas, lo indica en el campo isOpen and isBooked
   * @param {*} startHour 
   * @param {*} endHour 
   * @returns 
   */
  function generateCalendar(calendarData, startHour = 0, endHour = 24) {
    const data = {
      rows: []
    };
    /**
     * la infromacion de calendarData luce asi:
     * [
     *   {
     *     name: 'Lunes',
     *     openTimeBlocks: [ 4, 5 ],
     *     appointments: [{ _id, scheduledTimeBlocks: [ 4] }] 
     *   },
      *   {
     *     name: 'Martes',
     *     openTimeBlocks: [ 4, 5 ],
     *     appointments: [ { _id, scheduledTimeBlocks: [ 4, 5 ] } ] 
     *   },
     * ]
     * 
     * cuando no esta vacia
     */
    for (let i = startHour; i < endHour; i++) {
      let cols = []
      for (const day of calendarData.days) {
        // for (let j = 0; j < calendarData.day.length; j++) {
        const { openTimeBlocks, appointments } = day;
        const isOpen = openTimeBlocks && openTimeBlocks.includes(i)
        // we summarize all the appointments of the day, and
        const isBooked = appointments && appointments.flatMap(a => a.scheduledTimeBlocks).includes(i)
        cols.push({
          // revisamos si ya estaba abierto ese horario o si ya habia una reservacion 
          isOpen,
          isBooked,
          day: day.name,
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

  module.exports = generateCalendar;