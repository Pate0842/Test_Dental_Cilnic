class AppointmentSubject {
    constructor() {
      this.observers = [];
      this.appointment = null;
    }
  
    attach(observer) {
      this.observers.push(observer);
    }
  
    detach(observer) {
      this.observers = this.observers.filter((obs) => obs !== observer);
    }
  
    async notify() {
      console.log('Notifying observers with appointment:', this.appointment); // Debug log
      for (const observer of this.observers) {
        await observer.update(this.appointment);
      }
    }
  
    async setAppointment(appointment) {
      this.appointment = appointment;
      await this.notify();
    }
  }
  
  export default AppointmentSubject;