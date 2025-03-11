import AppointmentStrategy from "./appointmentStrategy.js";
import { Appointment } from "../../models/appointmentSchema.js";
import ErrorHandler from "../../middlewares/errorMiddlewares.js";

class GetAppointmentByIdStrategy extends AppointmentStrategy {
  async execute(req, res, next) {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return next(new ErrorHandler("Không tìm thấy cuộc hẹn!", 404));
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  }
}

export default new GetAppointmentByIdStrategy();
