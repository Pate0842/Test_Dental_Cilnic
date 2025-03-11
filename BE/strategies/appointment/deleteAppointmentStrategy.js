import AppointmentStrategy from "./appointmentStrategy.js";
import { Appointment } from "../../models/appointmentSchema.js";
import ErrorHandler from "../../middlewares/errorMiddlewares.js";

class DeleteAppointmentStrategy extends AppointmentStrategy {
  async execute(req, res, next) {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return next(new ErrorHandler("Không tìm thấy lịch hẹn!", 404));
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Đã xóa lịch hẹn!",
      appointment
    });
  }
}

export default new DeleteAppointmentStrategy();
