import Iterator from "./iterator.js";

class AppointmentsIterator extends Iterator {
  constructor(appointments) {
    super();
    this.appointments = appointments;
    this.index = 0;
  }

  hasNext() {
    return this.index < this.appointments.length;
  }

  next() {
    return this.hasNext() ? this.appointments[this.index++] : null;
  }
}

export default AppointmentsIterator;
