import AppointmentStrategy from "./appointmentStrategy.js";
import { Appointment } from "../../models/appointmentSchema.js";

class GetUserAppointmentStrategy extends AppointmentStrategy {
  async execute(req, res, next) {
    try {
      const patientId = req.user._id; // Lấy ID bệnh nhân từ middleware
      console.log("Patient ID:", patientId);

      const appointments = await Appointment.find({ patientId });
      console.log("Appointments found:", appointments);

      if (!appointments || appointments.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy lịch hẹn cho bệnh nhân này!",
        });
      }

      res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GetUserAppointmentStrategy();
