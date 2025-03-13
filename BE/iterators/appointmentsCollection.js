import AppointmentsIterator from "./appointmentsIterator.js";

class AppointmentsCollection {
  constructor(appointments = []) {
    this.appointments = appointments;
  }

  setAppointments(appointments) {
    this.appointments = appointments;
  }

  createIterator() {
    return new AppointmentsIterator(this.appointments);
  }
}

export default AppointmentsCollection;
