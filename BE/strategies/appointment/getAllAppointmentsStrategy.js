import AppointmentStrategy from "./appointmentStrategy.js";
import { Appointment } from "../../models/appointmentSchema.js";

class GetAllAppointmentsStrategy extends AppointmentStrategy {
  async execute(req, res, next) {
    const appointments = await Appointment.find();
    res.status(200).json({
      success: true,
      appointments,
    });
  }
}

export default new GetAllAppointmentsStrategy();
