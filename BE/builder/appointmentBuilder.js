class AppointmentBuilder {
  constructor() {
    this.appointmentData = {};
  }

  setPatientInfo(firstName, lastName, email, phone, cccd, dob, gender, address) {
    this.appointmentData.firstName = firstName;
    this.appointmentData.lastName = lastName;
    this.appointmentData.email = email;
    this.appointmentData.phone = phone;
    this.appointmentData.cccd = cccd;
    this.appointmentData.dob = dob;
    this.appointmentData.gender = gender;
    this.appointmentData.address = address;
    return this;
  }

  setDoctorInfo(doctorId, department, doctorFirstName, doctorLastName) {
    this.appointmentData.doctorId = doctorId;
    this.appointmentData.department = department;
    this.appointmentData.doctor = {
      firstName: doctorFirstName,
      lastName: doctorLastName
    };
    return this;
  }

  setAppointmentDate(date) {
    this.appointmentData.appointment_date = date;
    return this;
  }

  setPatientId(patientId) {
    this.appointmentData.patientId = patientId;
    return this;
  }

  setHasVisited(hasVisited) {
    this.appointmentData.hasVisited = hasVisited || false;
    return this;
  }

  build() {
    return this.appointmentData;
  }
}

export default AppointmentBuilder;
